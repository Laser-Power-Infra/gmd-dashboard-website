import 'server-only';

import { catalogWhere, cleanItemName, stockKey, toStockItem, type CatalogFilters } from '@/app/purchase/catalog';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * /purchase reads PurchaseItemPrice page by page: filtering is a WHERE on the
 * specs stored in metadata, paging is OFFSET/LIMIT, and only one page of rows
 * is ever loaded.
 */

const where = (f: Omit<CatalogFilters, 'page'>) => catalogWhere(f) as Prisma.PurchaseItemPriceWhereInput;

export function countCatalog(f: Omit<CatalogFilters, 'page'>) {
  return prisma.purchaseItemPrice.count({ where: where(f) });
}

/** One page of matching items, the page clamped to the last one. */
export async function getCatalogPage(f: CatalogFilters, pageSize: number) {
  const total = await countCatalog(f);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(f.page, pageCount);
  const rows = await prisma.purchaseItemPrice.findMany({
    where: where(f),
    select: { itemCode: true, itemName: true, imageUrl: true, metadata: true, price: true },
    orderBy: { id: 'asc' }, // cuids are time-ordered, so this is the original sheet order
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  return { items: rows.map(toStockItem), total, page, pageCount };
}

/**
 * Dropdown values and catalogue size, straight from the stored specs. Not
 * cached: four DISTINCTs over ~900 rows are cheap, and a cache would keep
 * serving stale options after items are added or re-specced.
 */
export async function getCatalogOptions() {
  // Keys are fixed literals below, never user input.
  const distinct = (key: string, order = key) =>
    prisma.$queryRawUnsafe<{ v: string }[]>(
      `SELECT v FROM (SELECT DISTINCT metadata->>'${key}' AS v, metadata->>'${order}' AS o FROM purchase_item_prices) t
       WHERE v IS NOT NULL ORDER BY ${order === key ? 'v' : 'o::numeric'}`
    );
  const [types, sizes, pns, mocs, catalogSize] = await Promise.all([
    distinct('type'),
    distinct('size', 'sizeMm'),
    distinct('pressure'),
    distinct('moc'),
    prisma.purchaseItemPrice.count(),
  ]);
  const vals = (r: { v: string }[]) => [...new Set(r.map((x) => x.v))];
  return { types: vals(types), sizes: vals(sizes), pns: vals(pns), mocs: vals(mocs), catalogSize };
}

export type StockLineInput = { itemCode: string; itemName: string; quantity: number; remarks: string };

/**
 * Re-resolves submitted list lines against PurchaseItemPrice (only those rows,
 * max 50). Name, category, unit, stock figure and unit price come from the
 * database, never from the browser. `unknown` lists codes with no match.
 */
export async function resolveStockLines(input: StockLineInput[]) {
  const rows = await prisma.purchaseItemPrice.findMany({
    where: {
      OR: input.map((l) => ({
        itemCode: l.itemCode,
        itemName: { equals: cleanItemName(l.itemName), mode: 'insensitive' as const },
      })),
    },
    select: { itemCode: true, itemName: true, metadata: true, price: true },
  });
  const byKey = new Map(rows.map((r) => [stockKey(r.itemCode, r.itemName), r]));

  const lines = [];
  const unknown: string[] = [];
  for (const line of input) {
    const row = byKey.get(stockKey(line.itemCode, cleanItemName(line.itemName)));
    if (!row) {
      unknown.push(line.itemCode);
      continue;
    }
    const m = row.metadata as { category?: string; unit?: string; rowCount?: number };
    lines.push({
      itemCode: row.itemCode,
      itemName: row.itemName,
      category: m.category ?? '',
      unit: m.unit ?? '',
      inStock: m.rowCount ?? 1,
      quantity: line.quantity,
      remarks: line.remarks,
      /** Rupees from the DB; the Buy Now total is built from this, never from the browser. */
      unitPrice: row.price == null ? null : Number(row.price),
    });
  }
  return { lines, unknown };
}

export type TypeTile = { type: string; count: number; image: string | null };

/**
 * One entry per item type for the /purchase "Valve type" filter: how many
 * are in stock and one photo to show (null for types without photos, such as spares).
 */
export async function getTypeShowcase(): Promise<TypeTile[]> {
  const rows = await prisma.$queryRaw<{ type: string | null; count: number; image: string | null }[]>`
    SELECT metadata->>'type' AS type,
           count(*)::int AS count,
           (array_agg("imageUrl" ORDER BY id) FILTER (WHERE "imageUrl" IS NOT NULL))[1] AS image
    FROM purchase_item_prices
    GROUP BY 1
    ORDER BY count DESC`;
  return rows.filter((r): r is TypeTile => r.type !== null);
}
