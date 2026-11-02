/**
 * Self-check for the enquiry trust boundary and the mail notifier.
 *
 * Exercises app/api/enquiry/schema.ts (what the browser is allowed to send)
 * and lib/notify.ts (what happens when email is unconfigured or the provider
 * fails), then asserts the Get a Quote modal's <option> list has not drifted
 * from the server-side enum, and finally that lib/enquiryStore.ts keeps the
 * enquiry whichever of the two paths - database, mail - is broken.
 *
 *   node scripts/check-enquiry.mjs
 *
 * No test runner in this repo, so this is a plain assert script.
 * It touches neither mail nor a database: the fetch notify would use and the
 * prisma.enquiry calls the store would make are both stubbed.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import module from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  QUOTE_VALVE_TYPES,
  enquirySchema,
} from '../app/api/enquiry/schema.ts';
import { sendEnquiry } from '../lib/notify.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Node has no tsconfig "paths", so teach it the "@/" alias the route uses. */
module.registerHooks({
  resolve(spec, ctx, next) {
    // ...and that "./schema" means "./schema.ts", which bundlers assume.
    if (/^\.{1,2}\//.test(spec) && !path.extname(spec)) return next(`${spec}.ts`, ctx);
    if (!spec.startsWith('@/')) return next(spec, ctx);
    const base = path.join(root, spec.slice(2));
    const file = ['.ts', '.tsx', ''].map((ext) => base + ext).find((p) => fs.existsSync(p));
    return { url: pathToFileURL(file ?? base).href, shortCircuit: true };
  },
});

/* lib/prisma.ts builds its client at import time and needs *a* URL; it is
   never connected to, because every call below is replaced by a stub. */
process.env.DATABASE_URL ??= 'postgresql://stub:stub@localhost:5432/stub';
const { prisma } = await import(pathToFileURL(path.join(root, 'lib/prisma.ts')).href);

let rows = [];
let saveThrows = false;
prisma.enquiry.create = async ({ data }) => {
  if (saveThrows) throw new Error('relation "enquiries" does not exist');
  const row = { id: `row${rows.length + 1}`, mailed: false, status: 'NEW', ...data };
  rows.push(row);
  return row;
};
prisma.enquiry.update = async ({ where, data }) => Object.assign(rows.find((r) => r.id === where.id), data);

const { POST } = await import(pathToFileURL(path.join(root, 'app/api/enquiry/route.ts')).href);

const post = (payload) =>
  POST(
    new Request('http://localhost/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

const QUOTE = {
  kind: 'quote',
  name: 'Alok Das',
  email: 'alok@example.com',
  phone: '+91 98765 43210',
  valveType: 'Butterfly Valve',
  quantity: '3',
  message: '  needs DN300  ',
};

const VALVE = {
  kind: 'valve',
  name: 'Alok Das',
  email: 'alok@example.com',
  phone: '9876543210',
  company: 'Industrial Ent.',
  valveId: 'butterfly',
  valveSize: 'DN 300',
  pressure: '1.6',
  operation: 'Gear Operated',
  message: '',
};

const bad = (input) => assert.equal(enquirySchema.safeParse(input).success, false);

/* ── Happy paths ─────────────────────────────────────────── */
const quote = enquirySchema.parse(QUOTE);
assert.equal(quote.quantity, 3, 'quantity must be coerced to a number');
assert.equal(quote.message, 'needs DN300', 'free text must be trimmed');
assert.equal(quote.company, '', 'company must default rather than be undefined');

const valve = enquirySchema.parse(VALVE);
assert.equal(valve.valveId, 'butterfly');

/* ── The trust boundary ──────────────────────────────────── */
bad({ ...QUOTE, kind: 'something-else' });      // unknown discriminator
bad({ ...QUOTE, valveType: 'Gold Valve' });     // off-catalogue product name
bad({ ...QUOTE, quantity: 0 });                 // zero quantity
bad({ ...QUOTE, quantity: -5 });                // negative quantity
bad({ ...QUOTE, quantity: 2.5 });               // fractional quantity
bad({ ...QUOTE, quantity: 10_000 });            // absurd quantity
bad({ ...QUOTE, email: 'not-an-email' });
bad({ ...QUOTE, name: 'A' });                   // too short
bad({ ...QUOTE, phone: 'call me maybe' });      // non-numeric phone
bad({ ...QUOTE, message: 'x'.repeat(2001) });   // oversized body
bad({ ...VALVE, valveId: '' });                 // product must be identified
bad({ ...VALVE, valveSize: '' });               // required field on the form

/* A price or product name the browser invents must never reach the email. */
const injected = enquirySchema.parse({ ...VALVE, price: 1, valveName: 'Fake Valve', total: 0 });
assert.ok(!('price' in injected) && !('valveName' in injected) && !('total' in injected),
  'unknown client-supplied fields must be stripped, never forwarded');

/* ── The modal's options must match the server enum ──────── */
const modal = fs.readFileSync(path.join(root, 'components', 'layout', 'GetQuoteModal.tsx'), 'utf8');
const options = [...modal.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
assert.ok(options.length > 0, 'expected to find the valve type <option> list');
assert.deepEqual(
  [...options].sort(),
  [...QUOTE_VALVE_TYPES].sort(),
  'GetQuoteModal options drifted from QUOTE_VALVE_TYPES - the server would reject a valid choice'
);

/* ── notify: unconfigured must fail loudly, never silently ─ */
const realFetch = globalThis.fetch;
const realError = console.error;
let logged = '';
console.error = (...args) => { logged += args.map(String).join(' '); };

for (const key of ['ENQUIRY_API_KEY', 'ENQUIRY_FROM', 'ENQUIRY_TO']) delete process.env[key];
globalThis.fetch = () => { throw new Error('notify must not call fetch when unconfigured'); };

let result = await sendEnquiry('subject', 'SECRET-PAYLOAD-MARKER');
assert.equal(result.ok, false);
assert.equal(result.reason, 'not-configured');
assert.match(result.detail, /ENQUIRY_API_KEY/);
assert.match(logged, /SECRET-PAYLOAD-MARKER/, 'an undeliverable enquiry must be logged in full');

/* ── notify: provider rejection must surface ─────────────── */
process.env.ENQUIRY_API_KEY = 'test-key';
process.env.ENQUIRY_FROM = 'site@example.com';
process.env.ENQUIRY_TO = 'a@example.com, b@example.com';

let sentBody = null;
globalThis.fetch = async (_url, init) => {
  sentBody = JSON.parse(init.body);
  return new Response('quota exceeded', { status: 429 });
};
logged = '';
result = await sendEnquiry('subject', 'LOST-ENQUIRY-MARKER');
assert.equal(result.ok, false);
assert.equal(result.reason, 'send-failed');
assert.match(result.detail, /429/);
assert.match(logged, /LOST-ENQUIRY-MARKER/, 'a failed send must be logged in full');
assert.deepEqual(sentBody.to, ['a@example.com', 'b@example.com'], 'ENQUIRY_TO must split on commas');

/* ── notify: success ─────────────────────────────────────── */
globalThis.fetch = async () => new Response('{"id":"x"}', { status: 200 });
result = await sendEnquiry('subject', 'body');
assert.deepEqual(result, { ok: true });

/* ── The route itself: product identity comes from data/ ─── */
globalThis.fetch = async () => new Response('{"id":"x"}', { status: 200 });

assert.equal((await post(VALVE)).status, 200, 'a valid valve enquiry must be accepted');
assert.equal((await post({ ...VALVE, valveId: 'no-such-valve' })).status, 400, 'unknown product id must be rejected');
assert.equal((await post({ ...VALVE, pressure: '99.9' })).status, 400, 'a pressure this valve does not offer must be rejected');
assert.equal((await post({ ...VALVE, operation: 'Rocket Actuated' })).status, 400, 'an operation mode this valve does not offer must be rejected');
assert.equal((await post({ ...VALVE, pressure: 'Custom', operation: 'Custom' })).status, 200, '"Custom" is a real option on both selects');
assert.equal((await post({ ...VALVE, valveId: 'prod-0', pressure: '', operation: 'Manual' })).status, 200, 'accessories have no pressure list');
assert.equal((await post(QUOTE)).status, 200, 'a valid quote request must be accepted');
assert.equal((await post({ ...QUOTE, valveType: 'Gold Valve' })).status, 400);

/* The emailed product name is ours, never the browser's. */
let subjectSeen = '';
globalThis.fetch = async (_url, init) => {
  subjectSeen = JSON.parse(init.body).subject;
  return new Response('{"id":"x"}', { status: 200 });
};
await post({ ...VALVE, valveName: 'Solid Gold Valve', price: 1 });
assert.match(subjectSeen, /Butterfly Valve/, 'subject must use the catalogue name for valveId "butterfly"');
assert.doesNotMatch(subjectSeen, /Gold/, 'a client-supplied product name must never reach the email');

/* ── The row is the record; mail is best-effort on top ───── */
globalThis.fetch = async () => new Response('{"id":"x"}', { status: 200 });
rows = [];
assert.equal((await post(VALVE)).status, 200);
assert.equal(rows.length, 1, 'every accepted enquiry must be stored');
assert.equal(rows[0].kind, 'valve');
assert.equal(rows[0].email, VALVE.email);
assert.equal(rows[0].phone, VALVE.phone);
assert.equal(rows[0].mailed, true, 'a sent enquiry must be flagged mailed');

/* Saved but not mailed: the enquiry is safe, so the customer sees success. */
globalThis.fetch = async () => new Response('nope', { status: 500 });
rows = [];
logged = '';
assert.equal((await post(VALVE)).status, 200, 'a saved enquiry must not be reported as a failure');
assert.equal(rows[0].mailed, false, 'mailed must record the real outcome - it is the admin chase list');
assert.match(logged, /Butterfly Valve/, 'an unmailed enquiry must still be logged in full');

/* The stored product name is ours, exactly as in the email. */
rows = [];
await post({ ...VALVE, valveName: 'Solid Gold Valve', price: 1 });
assert.match(rows[0].subject, /Butterfly Valve/, 'the stored subject must use the catalogue name');
assert.doesNotMatch(rows[0].subject + rows[0].details, /Gold/, 'a client-supplied product name must never be stored');

/* Lost by both paths: never ok:true. */
saveThrows = true;
rows = [];
logged = '';
assert.equal((await post(VALVE)).status, 503, 'an enquiry neither saved nor mailed must surface as an error');
assert.match(logged, /Butterfly Valve/, 'the lost enquiry must be in the log');

/* Mail alone still keeps it. */
globalThis.fetch = async () => new Response('{"id":"x"}', { status: 200 });
assert.equal((await post(VALVE)).status, 200, 'a mailed enquiry is safe even if the row could not be written');
saveThrows = false;

/* ── /purchase posts through the same store ──────────────── */
{
  const { POST: purchasePOST } = await import(
    pathToFileURL(path.join(root, 'app/api/purchase-enquiry/route.ts')).href
  );
  const item = JSON.parse(fs.readFileSync(path.join(root, 'public', 'purchaseItems.json'), 'utf8'))[0];
  rows = [];
  const res = await purchasePOST(
    new Request('http://localhost/api/purchase-enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alok Das',
        email: 'alok@example.com',
        phone: '9876543210',
        items: [{ itemCode: item.itemCode, itemName: item.itemName, quantity: 2 }],
      }),
    })
  );
  assert.equal(res.status, 200, 'a valid stock enquiry must be accepted');
  assert.equal(rows.length, 1, 'a stock enquiry must be stored too');
  assert.equal(rows[0].kind, 'purchase');
  assert.equal(rows[0].email, 'alok@example.com');
  assert.equal(rows[0].phone, '9876543210');
  assert.match(rows[0].details, new RegExp(item.itemCode), 'the stored item list must name the resolved item');
}

globalThis.fetch = realFetch;
console.error = realError;

console.log(`valve types        ${QUOTE_VALVE_TYPES.length} (modal options in sync)`);
console.log(`rejected payloads  12 schema, 4 route`);
console.log('');
console.log('OK - all invariants hold');

/* ---------------------------------------------------------------------------
 * /api/health is public, so it must never echo the mail settings back. A future
 * edit that adds "which var is missing" would name the business mailbox.
 * ------------------------------------------------------------------------- */
{
  const { GET } = await import(pathToFileURL(path.join(root, 'app/api/health/route.ts')).href);
  const SECRETS = {
    ENQUIRY_API_KEY: 're_SENTINELKEY_must_never_appear',
    ENQUIRY_FROM: 'sentinel-from@example.invalid',
    ENQUIRY_TO: 'sentinel-to@example.invalid',
  };
  const saved = { ...process.env };
  for (const [set, label] of [[true, 'configured'], [false, 'not-configured']]) {
    for (const k of Object.keys(SECRETS)) {
      if (set) process.env[k] = SECRETS[k];
      else delete process.env[k];
    }
    const body = await (await GET()).json();
    assert.deepEqual(
      Object.keys(body).sort(),
      ['mail', 'status', 'timestamp', 'uptime'],
      'health must expose exactly these keys - a new one may leak config'
    );
    assert.equal(body.mail, label, `health should report ${label}`);
    const text = JSON.stringify(body);
    for (const [name, value] of Object.entries(SECRETS)) {
      assert.doesNotMatch(text, new RegExp(value, 'i'), `health leaked ${name}`);
      assert.doesNotMatch(text, new RegExp(name, 'i'), `health named ${name}, which identifies the mailbox`);
    }
    // A length is a fingerprint, so assert no bare number matches a secret's length.
    for (const value of Object.values(SECRETS)) {
      assert.doesNotMatch(text, new RegExp(`\b${value.length}\b`), 'health exposed a secret-length number');
    }
  }
  process.env = saved;
  console.log('health endpoint    leaks nothing in either state');
}
