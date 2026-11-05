/**
 * Self-check for the /purchase catalogue parsing.
 *
 * Runs name cleaning, stock grouping, spec parsing and image matching over all
 * of public/purchaseItems.json, asserts the invariants the page relies on, and
 * prints the parse hit-rate per filter dimension.
 *
 *   node scripts/check-purchase-catalog.mjs
 *
 * No test runner in this repo, so this is a plain assert script.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildStock,
  cleanItemName,
  getItemImage,
  isComponentLine,
  isExcludedItem,
  stockKey,
} from '../app/purchase/catalog.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rows = JSON.parse(fs.readFileSync(path.join(root, 'public', 'purchaseItems.json'), 'utf8'));

const pct = (n, total) => `${n}/${total} (${((n / total) * 100).toFixed(1)}%)`;

/* ── cleanItemName unit cases ────────────────────────────── */
assert.equal(
  cleanItemName('SLUICE VALVE 80MM PN-16 METAL TO RUBBER DUCTILE IRON NON-RISING-9523'),
  'SLUICE VALVE 80MM PN-16 METAL TO RUBBER DUCTILE IRON NON-RISING'
);
assert.equal(cleanItemName('BUTTERFLY  VALVE   500MM'), 'BUTTERFLY VALVE 500MM'); // double spaces
assert.equal(cleanItemName('  CHECK VALVE 100MM PN-16  '), 'CHECK VALVE 100MM PN-16'); // PN-16 survives
assert.equal(cleanItemName('NON RETURN VALVE IS5312 PART-1.'), 'NON RETURN VALVE IS5312 PART-1'); // trailing dot
assert.equal(cleanItemName('ACTUATOR WD9200'), 'ACTUATOR WD9200'); // no hyphen, digits kept
assert.equal(cleanItemName(''), '');

/* ── Build ───────────────────────────────────────────────── */
const excluded = rows.filter((r) => isExcludedItem(r.itemName)).length;
const stock = buildStock(rows);
const totalQty = stock.reduce((sum, i) => sum + i.qty, 0);

assert.equal(totalQty + excluded, rows.length, 'row counts must account for every source row');
assert.equal(new Set(stock.map((i) => i.key)).size, stock.length, 'listing keys must be unique');
assert.ok(
  stock.every((i) => !/-\d{3,}$/.test(i.name)),
  'no displayed name may keep the internal -NNNN code suffix'
);
assert.ok(
  stock.every((i) => !/ {2}/.test(i.name) && i.name === i.name.trim()),
  'no displayed name may carry double or edge whitespace'
);

/* Codes that legitimately carry two different specs stay as separate entries. */
const perCode = new Map();
for (const i of stock) perCode.set(i.itemCode, (perCode.get(i.itemCode) ?? 0) + 1);
const splitCodes = [...perCode.entries()].filter(([, n]) => n > 1);

/* The enquiry route re-cleans the name the browser sends back, so cleaning
   must be idempotent or every submitted line would fail to resolve. */
assert.ok(
  stock.every((i) => cleanItemName(i.name) === i.name),
  'cleanItemName must be idempotent'
);
const serverKeys = new Set(stock.map((i) => stockKey(i.itemCode, i.name)));
assert.ok(
  stock.every((i) => serverKeys.has(stockKey(i.itemCode, cleanItemName(i.name)))),
  'every listed item must resolve against the server-side lookup used by /api/purchase-enquiry'
);

/* ── Images must exist on disk ───────────────────────────── */
const missing = [...new Set(stock.map((i) => i.image).filter(Boolean))].filter(
  (src) => !fs.existsSync(path.join(root, 'public', decodeURIComponent(src)))
);
assert.deepEqual(missing, [], 'every matched image path must exist under public/');

/* ── Acceptance criteria for the stock sale ──────────────── */

/* "No item name shows an internal code" - the -NNNN suffix is checked above;
   a bare code (RSD120013, or a leaked #N/A) must not leak into a name either. */
assert.ok(
  stock.every((i) => !/\b[A-Z]{2,3}\d{6,}\b/.test(i.name) && !i.name.includes('#N/A')),
  'no displayed name may contain a bare item code'
);
assert.ok(
  stock.every((i) => !/-\d{3,}$/.test(i.title)),
  'no card heading may keep the internal -NNNN code suffix'
);

/* "Each item shows photo + stock qty (or ready-stock tag)" - the card renders a
   photo or the "Photo on request" panel, so `image` must be a usable path or
   exactly null, never an empty/undefined value that would render a broken <img>. */
assert.ok(
  stock.every((i) => i.image === null || (typeof i.image === 'string' && i.image.startsWith('/'))),
  'image must be an absolute public path or null, so the fallback panel can take over'
);
/* The ready-stock tag is unconditional on the card, but it is only honest while
   every entry really did come from at least one source row. */
assert.ok(stock.every((i) => Number.isInteger(i.qty) && i.qty >= 1), 'every item needs a row count');

/* "Price or Request Quote on every item" - no price is known, so every card must
   fall to Request Quote. Guards against a half-done price rollout later. */
assert.ok(
  stock.every((i) => !('price' in i) || i.price == null),
  'no item may carry a price until Puja approves them; every card shows Request Quote'
);

/* A component must never borrow the photo of the valve it belongs to. */
const wrongPhoto = stock.filter((i) => i.image && isComponentLine(i.name, i.category));
assert.deepEqual(
  wrongPhoto.map((i) => i.name),
  [],
  'no component line may show a finished-valve photo'
);

/* getItemImage must stay pure and category-aware. */
assert.equal(getItemImage(''), null);
assert.equal(getItemImage('BUTTERFLY VALVE 600MM DISC DUCTILE IRON STD', 'CASTING'), null);
assert.equal(getItemImage('SPARE 20 x 110 HEX BOLT & NUT STAINLESS STEEL AISI 304', 'BOLTS & NUTS'), null);
assert.equal(
  getItemImage('SLUICE GATE 450X450MM PN-16 HW OP DUCTILE IRON FLANGE TYPE', 'TRADING VALVES'),
  '/purchase img/Sluice Gate Valve.webp'
);
/* "CONTROL-DIAPHRAGM TYPE" is actuation, not a diaphragm valve. */
assert.equal(
  getItemImage('PRESSURE REDUCING VALVE 150MM PN-16 FLOW REGULATION DUCTILE IRON CONTROL-DIAPHRAGM TYPE', 'TRADING VALVES'),
  '/purchase img/pressure reducing valve.webp'
);
/* "SPRING LOADED" is an attribute of a whole valve, not a component noun. */
assert.ok(getItemImage('PRESSURE REDUCING VALVE 80MM PN-16 SPRING LOADED DUCTILE IRON SAFETY', 'TRADING VALVES'));

/* Photo coverage is reported below; this floor makes a regression fail loudly
   rather than quietly shrinking the catalogue's photos. */
const covered = stock.filter((i) => i.image).length;
assert.ok(covered >= 357, `photo coverage regressed: ${covered} < 357`);

/* ── Report ──────────────────────────────────────────────── */
const withImage = stock.filter((i) => i.image).length;
const noImageByCategory = {};
for (const i of stock) if (!i.image) noImageByCategory[i.category] = (noImageByCategory[i.category] ?? 0) + 1;

console.log(`source rows            ${rows.length}`);
console.log(`excluded (consumables) ${excluded}`);
console.log(`listed items           ${stock.length}   (source rows grouped: ${totalQty})`);
console.log(`codes split by spec    ${splitCodes.length}  ${splitCodes.map(([c]) => c).join(', ')}`);
console.log(`max rows on one item   ${Math.max(...stock.map((i) => i.qty))}   (NOT published as a stock figure)`);
console.log('');
console.log('parse hit-rate per filter dimension');
console.log(`  type      ${pct(stock.filter((i) => i.type).length, stock.length)}`);
console.log(`  size      ${pct(stock.filter((i) => i.size).length, stock.length)}`);
console.log(`  pressure  ${pct(stock.filter((i) => i.pressure).length, stock.length)}`);
console.log(`  MOC       ${pct(stock.filter((i) => i.moc).length, stock.length)}`);
console.log('');
console.log(`photo match ${pct(withImage, stock.length)}   (floor asserted: 357)`);
console.log(`"Photo on request" fallback ${pct(stock.length - withImage, stock.length)}`);
console.log('  no photo, by category:');
for (const [cat, n] of Object.entries(noImageByCategory).sort((a, b) => b[1] - a[1]))
  console.log(`    ${cat.padEnd(20)} ${n}`);
console.log('');
console.log('distinct filter options');
console.log(`  types ${new Set(stock.map((i) => i.type)).size}`);
console.log(`  sizes ${new Set(stock.map((i) => i.size).filter(Boolean)).size}`);
console.log(`  PN    ${[...new Set(stock.map((i) => i.pressure).filter(Boolean))].sort().join(', ')}`);
console.log(`  MOC   ${[...new Set(stock.map((i) => i.moc).filter(Boolean))].sort().join(', ')}`);
console.log('');
console.log('OK - all invariants hold');
