/**
 * Display-layer catalogue logic for /purchase.
 *
 * `public/purchaseItems.json` is a raw dump of four columns - code, name,
 * category, unit - with no quantity and no date. Rows repeat, and the repeat
 * count was read as "units held". That reading is NOT established:
 *   - 94 of 125 distinct bolt lines appear exactly once (nobody stocks one bolt);
 *   - occurrences of one item are scattered across the file (index 4 and 1322),
 *     and the novelty curve has no step, so it is not per-location snapshots;
 *   - butterfly-valve DRIVE STUB appears exactly twice for all 10 sizes, which
 *     tracks the two stubs per valve rather than independent stock;
 *   - one itemCode is a leaked Excel "#N/A", so this is a hand-built sheet.
 * `qty` is therefore kept as a row count for grouping only and is not shown to
 * buyers. Nothing here mutates the file - names are cleaned and specs parsed on read.
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
  /** Number of source rows that collapsed into this entry. NOT a confirmed stock figure. */
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

/* `public/purchase img/` holds photos of complete valves only. A line that is a
   loose component of a valve must never borrow the photo of the valve it belongs
   to: a buyer shown an assembled butterfly valve on a bare disc casting can order
   the wrong part. These five categories hold components exclusively, so they are
   rejected wholesale. */
const COMPONENT_CATEGORIES = new Set([
  'CASTING',
  'SS SPARES',
  'BRONZE ITEMS',
  'RUBBER ITEMS',
  'BOLTS & NUTS',
]);

/* SPARES mixes complete valves with components, so it is filtered on the
   component noun instead. Verified against the whole dump: these fire on 19
   genuine component lines and on no complete valve. "SPRING" is deliberately
   absent - "PRESSURE REDUCING VALVE ... SPRING LOADED" is a whole valve.
   shortcut: BBD is read as a Body/Bonnet/Disc casting set and so gets no photo;
   if Puja confirms it means a light-duty complete valve, drop BBD from this list. */
const COMPONENT_NOUN =
  /\b(BODY|BONNET|DISC|WEDGE|GLAND|COVER|BUSH|SPINDLE|STUB|SEAT RING|SEAL KIT|GASKET|ROD|RETAINER|HEADSTOCK|NOZZLE|NIPPLE|BOLT|NUT|WASHER|SCREW|MOUNTAIN|ENDCAP|FLOAT GUIDE|BBD)\b/;

/** True when the line is a part of a valve rather than a valve. */
export function isComponentLine(itemName: string, category?: string): boolean {
  if (category && COMPONENT_CATEGORIES.has(category.toUpperCase())) return true;
  return COMPONENT_NOUN.test((itemName || '').toUpperCase());
}

/**
 * Keyword match against `public/purchase img/`. Returns null when the folder
 * has no photo that truthfully shows this line (components, bolts, actuators,
 * gear boxes) so the card can show the "Photo on request" panel instead.
 */
export function getItemImage(itemName: string, category?: string): string | null {
  const name = (itemName || '').toUpperCase();
  if (!name) return null;
  if (isComponentLine(name, category)) return null;

  // A sluice gate is a penstock gate, not a sluice valve - and it is what
  // "Sluice Gate Valve.webp" actually depicts.
  if (name.includes('SLUICE GATE')) return '/purchase img/Sluice Gate Valve.webp';

  if (name.includes('SLUICE VALVE') || name.includes('GATE VALVE')) {
    if (name.includes('KNIFE GATE')) return '/purchase img/knife gate Valve.webp';
    if (name.includes('METAL TO METAL') && name.includes('NON-RISING'))
      return '/purchase img/Metal Seated Sluice Valve (non Rising).webp';
    if (name.includes('METAL TO METAL')) return '/purchase img/Metal Seated Sluice Valve (Rising Spindle).webp';
    if (name.includes('NON-RISING')) return '/purchase img/Sluice valve (non rising).webp';
    if (name.includes('RISING')) return '/purchase img/Sluice valve (Rising Spindle) resilent Seated.webp';
    // Rising vs non-rising is not stated, and the two look different - no honest pick.
    return null;
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
  // "CONTROL-DIAPHRAGM TYPE" is the actuation of a PRV or solenoid valve, not a
  // diaphragm valve - match the product, so those fall through to their own photo.
  if (name.includes('DIAPHRAGM VALVE')) return '/purchase img/Diaphragm Valve.webp';
  if (name.includes('DISMANTLING')) return '/purchase img/Dismantling joint.webp';
  if (name.includes('FLOAT')) return '/purchase img/Float Valve.webp';
  if (name.includes('GLOBE')) return '/purchase img/Globe Valve.webp';
  // TPAV = tamper-proof air valve, same family as the kinetic air valve photo.
  if (name.includes('AIR VALVE') || name.includes('KINETIC') || name.startsWith('TPAV'))
    return '/purchase img/Kinetic Air Valve (DK type).webp';
  if (name.includes('FLANGE')) return '/purchase img/MS companion flange.webp';
  // The one "PRESSURE REDUCING VALVE ... SPRING LOADED ... SAFETY" line contradicts
  // itself; SPRING LOADED + SAFETY match this photo and rule out the pilot PRV one.
  if (name.includes('RELIEF') || (name.includes('SAFETY') && name.includes('SPRING LOADED')))
    return '/purchase img/Pressure relief valve (Spring loaded).webp';
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
 * Collapses repeated rows into one entry per item, carrying the row count as
 * `qty`. Insertion order is preserved so the listing matches the source dump.
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
      image: getItemImage(name, row.category),
    });
  }

  return [...byKey.values()];
}
