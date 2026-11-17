/**
 * Display-layer catalogue logic for /purchase. The data lives in PurchaseItemPrice
 * (see app/purchase/data.ts); this file turns a row's name into card specs and the
 * URL into a filter.
 *
 * `metadata.rowCount` is how many times the item repeated in the original stock
 * sheet. That was never confirmed to be units held, so it is not shown to buyers.
 *
 * Kept free of React and of `@/` aliases so `scripts/check-purchase-catalog.mjs`
 * can import it under plain node.
 */

export interface StockItem {
  /** Unique listing key - item code alone is not unique (9 codes carry two different specs). */
  key: string;
  itemCode: string;
  /** Cleaned name, safe to show to a buyer. */
  name: string;
  category: string;
  unit: string;
  /** metadata.rowCount - repeats in the original sheet. NOT a confirmed stock figure. */
  qty: number;
  size: string | null;
  sizeMm: number | null;
  pressure: string | null;
  moc: string | null;
  type: string;
  /** Name with size/pressure stripped, for the card heading. */
  title: string;
  specs: { label: string; value: string }[];
  image: string | null;
}

/**
 * Strips the trailing internal code suffix ("...NON-RISING-9523"), collapses
 * double spaces and drops trailing punctuation. `-\d{3,}` cannot swallow a
 * rating: PN-16 / Part-1 are at most two digits.
 */
export function cleanItemName(raw: string): string {
  return (raw || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*\d{3,}$/, '')
    .replace(/[\s,.;:\-]+$/, '')
    .trim();
}

/** Leading words before the first digit - "SLUICE VALVE", "BUTTERFLY VALVE", "ACTUATOR". */
export function itemType(name: string): string {
  const words: string[] = [];
  for (const w of name.split(' ')) {
    if (/\d/.test(w)) break;
    words.push(w);
  }
  return (words.join(' ').trim() || name.split(' ').slice(0, 2).join(' ')).trim();
}

const MOC_RULES: [RegExp, string][] = [
  [/DUCTILE IRON/, 'Ductile Iron'],
  [/CAST IRON/, 'Cast Iron'],
  [/STAINLESS STEEL|AISI/, 'Stainless Steel'],
  [/CAST STEEL|CARBON STEEL|FORGED STEEL|MILD STEEL/, 'Steel'],
  [/BRONZE|BRASS|GUN METAL/, 'Bronze / Brass'],
  [/RUBBER|EPDM|NITRILE/, 'Rubber'],
  [/\bPVC\b|PLASTIC|NYLON/, 'Plastic'],
];

export interface ParsedSpecs {
  size: string | null;
  sizeMm: number | null;
  pressure: string | null;
  moc: string | null;
  title: string;
  specs: { label: string; value: string }[];
}

export function parseItemSpecs(itemName: string): ParsedSpecs {
  const name = cleanItemName(itemName);
  const upper = name.toUpperCase();

  const sizeMatch = name.match(/\b(\d+(?:\.\d+)?)\s*MM\b/i);
  const size = sizeMatch ? `${sizeMatch[1]}MM` : null;
  const sizeMm = sizeMatch ? Number(sizeMatch[1]) : null;

  const pnMatch = name.match(/\bPN-?\s*(\d+(?:\.\d+)?)\b/i);
  const classMatch = name.match(/\bCLASS\s*(\d+)/i);
  const pressure = pnMatch ? `PN-${pnMatch[1]}` : classMatch ? `Class ${classMatch[1]}#` : null;

  const moc = MOC_RULES.find(([re]) => re.test(upper))?.[1] ?? null;

  const specs: { label: string; value: string }[] = [];

  if (/METAL TO METAL/.test(upper)) specs.push({ label: 'Seat', value: 'Metal to Metal' });
  else if (/METAL TO RUBBER|RESILE?NT SEATED/.test(upper)) specs.push({ label: 'Seat', value: 'Metal to Rubber' });

  if (/LEVER OPERATED/.test(upper)) specs.push({ label: 'Operation', value: 'Lever' });
  else if (/GEAR OPERATED|GEAR BOX|GEAR OP|GEAR$|GEAR /.test(upper)) specs.push({ label: 'Operation', value: 'Gear' });
  else if (/HW OP|HANDWHEEL|HAND WHEEL/.test(upper)) specs.push({ label: 'Operation', value: 'Handwheel' });

  if (/DOUBLE FLANGE/.test(upper)) specs.push({ label: 'End', value: 'Double Flanged' });
  else if (/FLANGE TYPE|FLANGE END|FLANGE/.test(upper)) specs.push({ label: 'End', value: 'Flanged' });
  else if (/WAFER/.test(upper)) specs.push({ label: 'End', value: 'Wafer' });
  else if (/BUTT WELD/.test(upper)) specs.push({ label: 'End', value: 'Butt Weld' });
  else if (/SCREWED|THREADED/.test(upper)) specs.push({ label: 'End', value: 'Screwed' });

  if (moc) specs.push({ label: 'MOC', value: moc });

  if (/2-PIECE/.test(upper)) specs.push({ label: 'Design', value: '2-Piece' });
  else if (/3-PIECE/.test(upper)) specs.push({ label: 'Design', value: '3-Piece' });

  const title = name
    .replace(/\b\d+(?:\.\d+)?\s*MM\b/gi, ' ')
    .replace(/\bPN-?\s*\d+(?:\.\d+)?\b/gi, ' ')
    .replace(/\bCLASS\s*\d+\s*#?/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return { size, sizeMm, pressure, moc, title: title || name, specs };
}

/** Listing key. Code alone is not unique, so the cleaned name joins it. */
export function stockKey(itemCode: string, cleanedName: string): string {
  return `${itemCode}|${cleanedName.toUpperCase()}`;
}

/** The PurchaseItemPrice columns a card needs. `itemName` is already cleaned. */
export interface CatalogRow {
  itemCode: string;
  itemName: string;
  imageUrl: string | null;
  metadata: unknown;
}

/** Specs stored in metadata so the database can filter on them (written by the purchase-item seed). */
export function filterableSpecs(itemName: string) {
  const p = parseItemSpecs(itemName);
  return { type: itemType(itemName), size: p.size, sizeMm: p.sizeMm, pressure: p.pressure, moc: p.moc };
}

/** One PurchaseItemPrice row -> card data. Specs are re-parsed from the name, the same way the seed stored them. */
export function toStockItem(row: CatalogRow): StockItem {
  const meta = (row.metadata ?? {}) as { category?: string; unit?: string; rowCount?: number };
  const parsed = parseItemSpecs(row.itemName);
  return {
    key: stockKey(row.itemCode, row.itemName),
    itemCode: row.itemCode,
    name: row.itemName,
    category: meta.category ?? '',
    unit: meta.unit ?? '',
    qty: meta.rowCount ?? 1,
    size: parsed.size,
    sizeMm: parsed.sizeMm,
    pressure: parsed.pressure,
    moc: parsed.moc,
    type: itemType(row.itemName),
    title: parsed.title,
    specs: parsed.specs,
    image: row.imageUrl,
  };
}

export interface CatalogFilters {
  q: string;
  type: string;
  size: string;
  pn: string;
  moc: string;
  page: number;
}

/** URL search params -> filters. Trust boundary: anything a visitor can type into the address bar. */
export function parseCatalogParams(sp: Record<string, string | string[] | undefined>): CatalogFilters {
  const str = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v ?? '').trim().slice(0, 100);
  };
  const page = Math.floor(Number(str('page')));
  return {
    q: str('q'),
    type: str('type'),
    size: str('size'),
    pn: str('pn'),
    moc: str('moc'),
    page: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

/**
 * Filters -> Prisma `where` for PurchaseItemPrice. type/size/pn/moc match the
 * values filterableSpecs() stored in metadata; q searches name and code.
 * Plain object (no Prisma import) so the check script can assert on it.
 */
export function catalogWhere(f: Omit<CatalogFilters, 'page'>) {
  const and: object[] = [];
  if (f.q)
    and.push({
      OR: [
        { itemName: { contains: f.q, mode: 'insensitive' } },
        { itemCode: { contains: f.q, mode: 'insensitive' } },
      ],
    });
  const json: [keyof typeof f, string][] = [['type', 'type'], ['size', 'size'], ['pn', 'pressure'], ['moc', 'moc']];
  for (const [param, key] of json) if (f[param]) and.push({ metadata: { path: [key], equals: f[param] } });
  return and.length ? { AND: and } : {};
}

/** Query string for a filter state, dropping empty values and page 1. */
export function catalogQuery(f: Partial<CatalogFilters>): string {
  const sp = new URLSearchParams();
  for (const k of ['q', 'type', 'size', 'pn', 'moc'] as const) if (f[k]) sp.set(k, f[k]);
  if (f.page && f.page > 1) sp.set('page', String(f.page));
  const s = sp.toString();
  return s ? `?${s}` : '';
}
