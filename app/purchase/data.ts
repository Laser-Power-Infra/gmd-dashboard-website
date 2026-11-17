import 'server-only';

import { catalogWhere, toStockItem, type CatalogFilters } from '@/app/purchase/catalog';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * /purchase reads PurchaseItemPrice page by page: filtering is a WHERE on the
 * specs stored in metadata, paging is OFFSET/LIMIT, and only one page of rows
 * is ever loaded. `price` is never selected - cards show "Request Quote".
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
    select: { itemCode: true, itemName: true, imageUrl: true, metadata: true },
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
