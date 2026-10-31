/**
 * Display-layer catalogue logic for /purchase.
 *
 * `public/purchaseItems.json` is a raw stock dump: one row per physical unit,
 * so the same item code repeats once per unit held. Nothing here mutates that
 * file - names are cleaned and specs are parsed on read.
 *
 * Kept free of React and of `@/` aliases so `scripts/check-purchase-catalog.mjs`
 * can import it under plain node.
 */

export interface MasterRow {
  itemCode: string;
  itemName: string;
  category: string;
  unit: string;
}

export interface StockItem {
  /** Unique listing key - item code alone is not unique (9 codes carry two different specs). */
  key: string;
  itemCode: string;
  /** Cleaned name, safe to show to a buyer. */
  name: string;
  category: string;
  unit: string;
  /** Units held in stock = number of source rows that collapsed into this entry. */
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

/**
 * Keyword match against `public/purchase img/`. Returns null when the folder
 * has no photo for this line (spares, bolts, castings, actuators) so the card
 * can show a placeholder instead of a broken <img>.
 */
export function getItemImage(itemName: string): string | null {
  const name = (itemName || '').toUpperCase();
  if (!name) return null;

  if (name.includes('SLUICE VALVE') || name.includes('GATE VALVE')) {
    if (name.includes('KNIFE GATE')) return '/purchase img/knife gate Valve.webp';
    if (name.includes('METAL TO METAL') && name.includes('NON-RISING'))
      return '/purchase img/Metal Seated Sluice Valve (non Rising).webp';
    if (name.includes('METAL TO METAL')) return '/purchase img/Metal Seated Sluice Valve (Rising Spindle).webp';
    if (name.includes('NON-RISING')) return '/purchase img/Sluice valve (non rising).webp';
    if (name.includes('RISING')) return '/purchase img/Sluice valve (Rising Spindle) resilent Seated.webp';
    return '/purchase img/Sluice Gate Valve.webp';
  }

  if (name.includes('BUTTERFLY VALVE')) {
    if (name.includes('WAFER TYPE')) return '/purchase img/Wafer Type butterfly valve.webp';
    if (name.includes('LUG TYPE') && name.includes('METAL TO METAL'))
      return '/purchase img/Lug type (Metal to Metal ) butterfly valve.webp';
    if (name.includes('LUG TYPE')) return '/purchase img/Lug type (Metal to Rubber) butterfly valve.webp';
    if (name.includes('METAL TO METAL')) return '/purchase img/Double Flange Metal Seated Butterfly Valve.webp';
    return '/purchase img/Double Flange Resilent Seated Butterfly Valve.webp';
  }

  if (name.includes('BALL VALVE')) {
    if (name.includes('2-PIECE')) return '/purchase img/2 piece ball valve.webp';
    if (name.includes('SCREWED')) return '/purchase img/screw ball valve.webp';
    return '/purchase img/3 piece ball valve.webp';
  }

  if (name.includes('DPCV')) return '/purchase img/Dual Plate Check Valve (API594).webp';
  if (name.includes('CHECK VALVE') || name.includes('FOOT VALVE'))
    return '/purchase img/Non return check valve (IS5312, Part-1.webp';
  if (name.includes('DIAPHRAGM')) return '/purchase img/Diaphragm Valve.webp';
  if (name.includes('DISMANTLING')) return '/purchase img/Dismantling joint.webp';
  if (name.includes('FLOAT')) return '/purchase img/Float Valve.webp';
  if (name.includes('GLOBE')) return '/purchase img/Globe Valve.webp';
  // TPAV = tamper-proof air valve, same family as the kinetic air valve photo.
  if (name.includes('AIR VALVE') || name.includes('KINETIC') || name.startsWith('TPAV'))
    return '/purchase img/Kinetic Air Valve (DK type).webp';
  if (name.includes('FLANGE')) return '/purchase img/MS companion flange.webp';
  if (name.includes('RELIEF')) return '/purchase img/Pressure relief valve (Spring loaded).webp';
  if (name.includes('NEEDLE')) return '/purchase img/needle valve.webp';
  if (name.includes('REDUCING') || name.includes('PRV')) return '/purchase img/pressure reducing valve.webp';
  if (name.includes('SOLENOID')) return '/purchase img/solenoid Valve.webp';

  return null;
}

/* Consumables / tools / stationery lines that are not part of the sale catalogue.
   Matched as a case-insensitive prefix so variants such as
   "TOOLS & FIXTURES 6NM AIR WRENCH..." are covered too. */
const EXCLUDED_ITEM_PREFIXES = [
  'CONSUMABLES',
  'OIL & LUBE',
  'PRINTING & STATIONERY',
  'WASTAGE BUBBLE WRAP PLASTIC',
  'TOOLS & FIXTURES',
];

export function isExcludedItem(itemName: string): boolean {
  const name = (itemName || '').toUpperCase();
  return EXCLUDED_ITEM_PREFIXES.some((prefix) => name.startsWith(prefix));
}

/** Listing key. Code alone is not unique, so the cleaned name joins it. */
export function stockKey(itemCode: string, cleanedName: string): string {
  return `${itemCode}|${cleanedName.toUpperCase()}`;
}

/**
 * Collapses the per-unit rows into one entry per item, carrying the unit count
 * as `qty`. Insertion order is preserved so the listing matches the source dump.
 */
export function buildStock(rows: MasterRow[]): StockItem[] {
  const byKey = new Map<string, StockItem>();

  for (const row of rows) {
    if (isExcludedItem(row.itemName)) continue;
    const name = cleanItemName(row.itemName);
    if (!name) continue;

    const key = stockKey(row.itemCode, name);
    const existing = byKey.get(key);
    if (existing) {
      existing.qty += 1;
      continue;
    }

    const parsed = parseItemSpecs(name);
    byKey.set(key, {
      key,
      itemCode: row.itemCode,
      name,
      category: row.category,
      unit: row.unit,
      qty: 1,
      size: parsed.size,
      sizeMm: parsed.sizeMm,
      pressure: parsed.pressure,
      moc: parsed.moc,
      type: itemType(name),
      title: parsed.title,
      specs: parsed.specs,
      image: getItemImage(name),
    });
  }

  return [...byKey.values()];
}
