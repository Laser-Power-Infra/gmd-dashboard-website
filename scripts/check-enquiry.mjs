/**
 * Self-check for the enquiry trust boundary and the mail notifier.
 *
 * Exercises app/api/enquiry/schema.ts (what the browser is allowed to send)
 * and lib/notify.ts (what happens when email is unconfigured or the provider
 * fails), then asserts the Get a Quote modal's <option> list has not drifted
 * from the server-side enum.
 *
 *   node scripts/check-enquiry.mjs
 *
 * No test runner in this repo, so this is a plain assert script.
 * It never sends mail: the fetch it would use is stubbed.
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

/* An enquiry that cannot be emailed must never look successful to the caller. */
globalThis.fetch = async () => new Response('nope', { status: 500 });
logged = '';
assert.equal((await post(VALVE)).status, 503, 'a failed send must surface as an error, not ok:true');
assert.match(logged, /Butterfly Valve/, 'the undeliverable enquiry must be in the log');

globalThis.fetch = realFetch;
console.error = realError;

console.log(`valve types        ${QUOTE_VALVE_TYPES.length} (modal options in sync)`);
console.log(`rejected payloads  12 schema, 4 route`);
console.log('');
console.log('OK - all invariants hold');
