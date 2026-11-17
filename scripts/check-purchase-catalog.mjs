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
  filterableSpecs,
  parseCatalogParams,
  parseItemSpecs,
  toStockItem,
} from '../app/purchase/catalog.ts';

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

/* ── URL params (trust boundary) ─────────────────────────── */
assert.deepEqual(parseCatalogParams({}), { q: '', type: '', size: '', pn: '', moc: '', page: 1 });
assert.equal(parseCatalogParams({ page: 'junk' }).page, 1);
assert.equal(parseCatalogParams({ page: '-3' }).page, 1);
assert.equal(parseCatalogParams({ page: '2.7' }).page, 2);
assert.equal(parseCatalogParams({ type: ['A', 'B'] }).type, 'A');
assert.equal(parseCatalogParams({ q: 'x'.repeat(500) }).q.length, 100);

assert.equal(catalogQuery({ q: '', type: 'SLUICE VALVE', page: 1 }), '?type=SLUICE+VALVE');
assert.equal(catalogQuery({ page: 3 }), '?page=3');
assert.equal(catalogQuery({}), '');

/* ── Prisma where ────────────────────────────────────────── */
assert.deepEqual(catalogWhere(parseCatalogParams({})), {});
assert.deepEqual(catalogWhere(parseCatalogParams({ type: 'SLUICE VALVE', size: '200MM', pn: 'PN-16' })), {
  AND: [
    { metadata: { path: ['type'], equals: 'SLUICE VALVE' } },
    { metadata: { path: ['size'], equals: '200MM' } },
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
