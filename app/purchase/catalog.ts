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
  /** Display label from PurchaseItemPrice.price (rupees), formatted on the server so hydration matches. */
  price: string | null;
  /** Same price as a number (rupees), for the list total. The server re-prices on Buy Now. */
  unitPrice: number | null;
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
  /** Prisma Decimal (rupees) or number; omitted = no price shown. */
  price?: { toString(): string } | number | null;
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
  const unitPrice = row.price == null ? null : Number(row.price.toString());
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
    price: unitPrice == null ? null : `₹${unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
    unitPrice,
  };
}

/** The multi-value facets. Within a facet values OR together; facets AND together. */
export const FACETS = ['type', 'size', 'pn', 'moc'] as const;
export type FacetKey = (typeof FACETS)[number];
const MAX_VALUES_PER_FACET = 30;

export interface CatalogFilters {
  q: string;
  type: string[];
  size: string[];
  pn: string[];
  moc: string[];
  page: number;
}

/** URL search params -> filters. Trust boundary: anything a visitor can type into the address bar. */
export function parseCatalogParams(sp: Record<string, string | string[] | undefined>): CatalogFilters {
  const all = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v : v ? [v] : []).map((x) => x.trim().slice(0, 100));
  };
  // Repeated params (?type=A&type=B) -> deduplicated, non-empty, capped list.
  const list = (k: string) => [...new Set(all(k).filter(Boolean))].slice(0, MAX_VALUES_PER_FACET);
  const page = Math.floor(Number(all('page')[0] ?? ''));
  return {
    q: all('q')[0] ?? '',
    type: list('type'),
    size: list('size'),
    pn: list('pn'),
    moc: list('moc'),
    page: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

/** The list with `value` added, or removed if it was already there. */
export function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// URL param -> key the seed stored in metadata (filterableSpecs).
const METADATA_KEY: Record<FacetKey, string> = { type: 'type', size: 'size', pn: 'pressure', moc: 'moc' };

/**
 * Filters -> Prisma `where` for PurchaseItemPrice. Each facet matches any of its
 * values (OR); facets combine with AND; q searches name and code.
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
  for (const facet of FACETS) {
    const match = (v: string) => ({ metadata: { path: [METADATA_KEY[facet]], equals: v } });
    const values = f[facet];
    if (values.length === 1) and.push(match(values[0]));
    else if (values.length > 1) and.push({ OR: values.map(match) });
  }
  return and.length ? { AND: and } : {};
}

/** Query string for a filter state: one param per value, empty values and page 1 dropped. */
export function catalogQuery(f: Partial<CatalogFilters>): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set('q', f.q);
  for (const k of FACETS) for (const v of f[k] ?? []) if (v) sp.append(k, v);
  if (f.page && f.page > 1) sp.set('page', String(f.page));
  const s = sp.toString();
  return s ? `?${s}` : '';
}

// Shop-floor abbreviations that stay in capitals when a name is sentence-cased.
const KEEP_CAPS = new Set([
  'PN', 'DN', 'NB', 'MS', 'SS', 'DI', 'CI', 'CS', 'GM', 'AISI', 'EPDM', 'NBR', 'PVC', 'UPVC', 'HDPE',
  'DPCV', 'BBD', 'TPAV', 'PRV', 'NRV', 'IS', 'BS', 'API', 'DIN', 'ANSI', 'HW', 'OP', 'DK', 'STD', 'RF', 'FF',
]);
// Words that open a new attribute (seat, material, rising, ends, operation), so a comma goes before them.
const ATTRIBUTE_START =
  /^(METAL|DUCTILE|CAST|STAINLESS|BRONZE|BRASS|GUN|MILD|CARBON|FORGED|RISING|NON-RISING|DOUBLE|FLANGE|FLANGED|WAFER|LUG|GEAR|LEVER|HANDWHEEL|SCREWED|THREADED|BUTT|SPRING|RESILENT|RESILIENT)$/;
const CONNECTORS = new Set(['TO', 'AND', '&', 'WITH', 'OF']);
// First words of two-word attributes ('double flange', 'gun metal'): no comma inside the pair.
const PAIR_START = new Set(['DOUBLE', 'GUN', 'CAST', 'DUCTILE', 'STAINLESS', 'CARBON', 'MILD', 'FORGED', 'BUTT', 'SPRING', 'COMPANION']);

/**
 * ERP capitals -> a readable sentence-case name:
 * "SLUICE VALVE 40MM PN-16 METAL TO RUBBER DUCTILE IRON NON-RISING"
 *   -> "Sluice valve 40 mm PN 16, metal to rubber, ductile iron, non-rising".
 * Codes, ratings and anything with a digit keep their capitals.
 */
export function displayName(raw: string): string {
  const words = cleanItemName(raw)
    .replace(/\b(\d+(?:\.\d+)?)\s*MM\b/gi, '$1 mm')
    .replace(/\bPN-?\s*(\d+(?:\.\d+)?)\b/gi, 'PN $1')
    .split(' ')
    .filter(Boolean);

  const out: string[] = [];
  let prevUp = '';
  for (const w of words) {
    const up = w.toUpperCase();
    const word =
      w === 'mm' ? 'mm' : /\d/.test(w) || KEEP_CAPS.has(up.replace(/[^A-Z]/g, '')) ? up : w.toLowerCase();
    const opensAttribute =
      out.length > 0 && ATTRIBUTE_START.test(up) && !PAIR_START.has(prevUp) && !CONNECTORS.has(prevUp);
    if (opensAttribute) out[out.length - 1] += ',';
    out.push(word);
    prevUp = up;
  }
  const s = out.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}
