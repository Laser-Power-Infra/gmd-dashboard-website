/**
 * Self-check for the /purchase catalogue logic in app/purchase/catalog.ts:
 * name cleaning, spec parsing, URL params and the Prisma `where` the page
 * filters with. Pure functions only - no database, no files.
 *
 *   node scripts/check-purchase-catalog.mjs
 *
 * No test runner in this repo, so this is a plain assert script.
 */
import assert from 'node:assert/strict';

import {
  catalogQuery,
  catalogWhere,
  cleanItemName,
  displayName,
  filterableSpecs,
  parseCatalogParams,
  toggle,
  parseItemSpecs,
  toStockItem,
} from '../app/purchase/catalog.ts';
import { canPayOnline } from '../lib/paymentLimit.ts';
import { purchaseLinesSchema } from '../lib/schemas/cost.ts';
import { normalizeCode, planPriceUpdates } from '../app/purchase/priceSnapshot.ts';

/* ── Price push from gmd-quotation (RawMaterial.cost by erpItemCode) ── */
assert.equal(normalizeCode('  rsd120013 '), 'RSD120013');
{
  const rows = [
    { id: 'a', itemCode: 'RSD120013', price: 1 }, // matched -> real cost
    { id: 'b', itemCode: 'RSD130024', price: 1 }, // cost 0 -> on request
    { id: 'c', itemCode: 'RSD999999', price: 1 }, // not in snapshot -> on request
    { id: 'd', itemCode: 'RBD010030', price: 4250.5 }, // unchanged -> no write
    { id: 'e', itemCode: 'FBC010201', price: null }, // same code, two specs -> both priced
    { id: 'f', itemCode: 'FBC010201', price: null },
    { id: 'g', itemCode: '#N/A', price: 1 }, // leaked sheet error never matches
    { id: 'h', itemCode: 'RSD110042', price: null }, // null cost, already null -> no write
  ];
  const snapshot = [
    { erpItemCode: ' rsd120013', cost: 12345.678 },
    { erpItemCode: 'RSD130024', cost: 0 },
    { erpItemCode: 'RBD010030', cost: 4250.5 },
    { erpItemCode: 'FBC010201', cost: 980 },
    { erpItemCode: 'RSD110042', cost: null },
  ];
  const { updates, priced, onRequest } = planPriceUpdates(rows, snapshot);
  assert.deepEqual(updates, [
    { id: 'a', price: 12345.68 },
    { id: 'b', price: null },
    { id: 'c', price: null },
    { id: 'e', price: 980 },
    { id: 'f', price: 980 },
    { id: 'g', price: null },
  ]);
  assert.equal(priced, 4); // a, d, e, f
  assert.equal(onRequest, 4); // b, c, g, h
}

/* ── List validation: readable messages at the trust boundary ── */
const firstIssue = (input) => purchaseLinesSchema.safeParse(input).error?.issues[0]?.message;
const QTY_MSG = 'Quantity must be a whole number from 1 to 9,999';
assert.equal(firstIssue([{ itemCode: 'A', itemName: 'X', quantity: 2000000 }]), QTY_MSG);
assert.equal(firstIssue([{ itemCode: 'A', itemName: 'X', quantity: 0 }]), QTY_MSG);
assert.equal(firstIssue([{ itemCode: 'A', itemName: 'X', quantity: 1.5 }]), QTY_MSG);
assert.equal(firstIssue([{ itemCode: 'A', itemName: 'X', quantity: 'abc' }]), QTY_MSG);
assert.equal(firstIssue([]), 'Add at least one item to your list');
assert.equal(firstIssue([{ itemCode: 'A', itemName: 'X', quantity: 1, remarks: 'x'.repeat(501) }]), 'Remarks must be 500 characters or fewer');
assert.equal(purchaseLinesSchema.safeParse([{ itemCode: 'A', itemName: 'X', quantity: '9999' }]).success, true);

/* ── cleanItemName ───────────────────────────────────────── */
assert.equal(
  cleanItemName('SLUICE VALVE 80MM PN-16 METAL TO RUBBER DUCTILE IRON NON-RISING-9523'),
  'SLUICE VALVE 80MM PN-16 METAL TO RUBBER DUCTILE IRON NON-RISING'
);
assert.equal(cleanItemName('BUTTERFLY  VALVE   500MM'), 'BUTTERFLY VALVE 500MM'); // double spaces
assert.equal(cleanItemName('  CHECK VALVE 100MM PN-16  '), 'CHECK VALVE 100MM PN-16'); // PN-16 survives
assert.equal(cleanItemName('NON RETURN VALVE IS5312 PART-1.'), 'NON RETURN VALVE IS5312 PART-1'); // trailing dot
assert.equal(cleanItemName('ACTUATOR WD9200'), 'ACTUATOR WD9200'); // no hyphen, digits kept
assert.equal(cleanItemName(''), '');

/* ── Spec parsing: what the cards show and the filters match ── */
const BFV = 'BUTTERFLY VALVE 200MM PN-16 METAL TO RUBBER DUCTILE IRON DOUBLE FLANGE GEAR OPERATED';
const p = parseItemSpecs(BFV);
assert.equal(p.size, '200MM');
assert.equal(p.sizeMm, 200);
assert.equal(p.pressure, 'PN-16');
assert.equal(p.moc, 'Ductile Iron');
assert.equal(p.title, 'BUTTERFLY VALVE METAL TO RUBBER DUCTILE IRON DOUBLE FLANGE GEAR OPERATED');
assert.deepEqual(
  p.specs.map((s) => `${s.label}:${s.value}`),
  ['Seat:Metal to Rubber', 'Operation:Gear', 'End:Double Flanged', 'MOC:Ductile Iron']
);
assert.equal(parseItemSpecs('GATE VALVE 50MM CLASS 150 CAST STEEL').pressure, 'Class 150#');
assert.equal(parseItemSpecs('ACTUATOR WD9200').size, null);

/* The seed stores filterableSpecs in metadata and the card re-parses the name:
   the two must agree, or a filter would show cards whose badge disagrees. */
assert.deepEqual(filterableSpecs(BFV), {
  type: 'BUTTERFLY VALVE',
  size: '200MM',
  sizeMm: 200,
  pressure: 'PN-16',
  moc: 'Ductile Iron',
});
const card = toStockItem({ itemCode: 'RBD1', itemName: BFV, imageUrl: null, metadata: { category: 'TRADING VALVES', unit: 'NO', rowCount: 2 } });
const fs = filterableSpecs(BFV);
assert.deepEqual([card.type, card.size, card.pressure, card.moc], [fs.type, fs.size, fs.pressure, fs.moc]);
assert.equal(card.qty, 2);
assert.equal(card.key, `RBD1|${BFV}`);

/* Price label: rupees, Indian digit grouping, formatted once on the server. */
const row = { itemCode: 'X1', itemName: BFV, imageUrl: null, metadata: {} };
assert.equal(card.price, null, 'no price column -> no label');
assert.equal(toStockItem({ ...row, price: 1 }).price, '₹1');
assert.equal(toStockItem({ ...row, price: 1250000.5 }).price, '₹12,50,000.5');
assert.equal(toStockItem({ ...row, price: { toString: () => '99.99' } }).price, '₹99.99'); // Prisma Decimal
assert.equal(toStockItem({ ...row, price: { toString: () => '99.99' } }).unitPrice, 99.99);
assert.equal(card.unitPrice, null);

/* Buy Now vs Request Quote: online only strictly below 20 lakh, never for 0 or unknown. */
assert.equal(canPayOnline(20_00_000 * 100 - 1), true);
assert.equal(canPayOnline(20_00_000 * 100), false);
assert.equal(canPayOnline(0), false);
assert.equal(canPayOnline(null), false);

/* ── displayName: ERP capitals -> readable sentence case ── */
assert.equal(displayName('SLUICE VALVE 40MM PN-16 METAL TO RUBBER DUCTILE IRON NON-RISING'), 'Sluice valve 40 mm PN 16, metal to rubber, ductile iron, non-rising');
assert.equal(displayName(BFV), 'Butterfly valve 200 mm PN 16, metal to rubber, ductile iron, double flange, gear operated');
assert.equal(displayName('SLUICE VALVE METAL TO METAL GUN METAL RISING'), 'Sluice valve, metal to metal, gun metal, rising');
assert.equal(displayName('NON RETURN VALVE IS5312 PART-1'), 'Non return valve IS5312 PART-1');
assert.equal(displayName('SPARE 20 x 110 HEX BOLT & NUT STAINLESS STEEL AISI 304'), 'Spare 20 x 110 hex bolt & nut, stainless steel AISI 304');
assert.equal(displayName(''), '');
assert.equal(displayName('COMPANION FLANGE'), 'Companion flange'); // a type name, not an attribute list

/* ── URL params (trust boundary) ─────────────────────────── */
assert.deepEqual(parseCatalogParams({}), { q: '', type: [], size: [], pn: [], moc: [], page: 1 });
assert.equal(parseCatalogParams({ page: 'junk' }).page, 1);
assert.equal(parseCatalogParams({ page: '-3' }).page, 1);
assert.equal(parseCatalogParams({ page: '2.7' }).page, 2);
assert.equal(parseCatalogParams({ q: 'x'.repeat(500) }).q.length, 100);
// Multi-select: repeated params -> trimmed, de-duplicated, empties dropped, capped.
assert.deepEqual(parseCatalogParams({ type: ['A', ' B ', 'A', ''] }).type, ['A', 'B']);
assert.deepEqual(parseCatalogParams({ size: '200MM' }).size, ['200MM']);
assert.equal(parseCatalogParams({ moc: Array.from({ length: 50 }, (_, i) => `m${i}`) }).moc.length, 30);
assert.equal(parseCatalogParams({ pn: ['y'.repeat(300)] }).pn[0].length, 100);

assert.equal(catalogQuery({ q: '', type: ['SLUICE VALVE'], page: 1 }), '?type=SLUICE+VALVE');
assert.equal(catalogQuery({ type: ['A', 'B'], size: ['200MM'] }), '?type=A&type=B&size=200MM');
assert.equal(catalogQuery({ page: 3 }), '?page=3');
assert.equal(catalogQuery({}), '');
// query -> params -> query round-trips with several values per facet
const rt = parseCatalogParams(Object.fromEntries(
  [...new URLSearchParams('type=A&type=B&pn=PN-16&page=2')].reduce((m, [k, v]) => m.set(k, [...(m.get(k) ?? []), v]), new Map())
));
assert.equal(catalogQuery(rt), '?type=A&type=B&pn=PN-16&page=2');

assert.deepEqual(toggle(['A'], 'B'), ['A', 'B']);
assert.deepEqual(toggle(['A', 'B'], 'A'), ['B']);
assert.deepEqual(toggle([], 'A'), ['A']);

/* ── Prisma where ────────────────────────────────────────── */
assert.deepEqual(catalogWhere(parseCatalogParams({})), {});
assert.deepEqual(catalogWhere(parseCatalogParams({ type: 'SLUICE VALVE', size: '200MM', pn: 'PN-16' })), {
  AND: [
    { metadata: { path: ['type'], equals: 'SLUICE VALVE' } },
    { metadata: { path: ['size'], equals: '200MM' } },
    { metadata: { path: ['pressure'], equals: 'PN-16' } },
  ],
});
// Several values in one facet widen (OR); facets still narrow each other (AND).
assert.deepEqual(catalogWhere(parseCatalogParams({ type: ['SLUICE VALVE', 'BUTTERFLY VALVE'], pn: 'PN-16' })), {
  AND: [
    {
      OR: [
        { metadata: { path: ['type'], equals: 'SLUICE VALVE' } },
        { metadata: { path: ['type'], equals: 'BUTTERFLY VALVE' } },
      ],
    },
    { metadata: { path: ['pressure'], equals: 'PN-16' } },
  ],
});
assert.deepEqual(catalogWhere(parseCatalogParams({ q: 'rsd12' })), {
  AND: [
    {
      OR: [
        { itemName: { contains: 'rsd12', mode: 'insensitive' } },
        { itemCode: { contains: 'rsd12', mode: 'insensitive' } },
      ],
    },
  ],
});

console.log('OK - all catalogue checks hold');
