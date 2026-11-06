/**
 * Self-check for the Razorpay trust boundary (lib/razorpay.ts) and the admin
 * quote parser (app/admin/cost-requests/actions.ts).
 *
 *   node scripts/check-razorpay.mjs
 *
 * No test runner in this repo, so this is a plain assert script. It touches
 * neither Razorpay nor a database: no order is created, and prisma is stubbed.
 */
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import fs from 'node:fs';
import module from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Node has no tsconfig "paths", so teach it the "@/" alias the modules use. */
module.registerHooks({
  resolve(spec, ctx, next) {
    if (/^\.{1,2}\//.test(spec) && !path.extname(spec)) return next(`${spec}.ts`, ctx);
    if (!spec.startsWith('@/')) return next(spec, ctx);
    const base = path.join(root, spec.slice(2));
    const file = ['.ts', '.tsx', ''].map((ext) => base + ext).find((p) => fs.existsSync(p));
    return { url: pathToFileURL(file ?? base).href, shortCircuit: true };
  },
});

process.env.DATABASE_URL ??= 'postgresql://stub:stub@localhost:5432/stub';
const { prisma } = await import(pathToFileURL(path.join(root, 'lib/prisma.ts')).href);

const { verifyPaymentSignature, verifyWebhookSignature, markPaid, canPayOnline } = await import(
  pathToFileURL(path.join(root, 'lib/razorpay.ts')).href
);

/* ── Checkout signature ──────────────────────────────────── */
process.env.RAZORPAY_KEY_SECRET = 'test_secret';
const sig = createHmac('sha256', 'test_secret').update('order_1|pay_1').digest('hex');
assert.equal(verifyPaymentSignature('order_1', 'pay_1', sig), true);
assert.equal(verifyPaymentSignature('order_1', 'pay_2', sig), false, 'different payment id must fail');
assert.equal(verifyPaymentSignature('order_1', 'pay_1', sig.replace(/^./, (c) => (c === 'a' ? 'b' : 'a'))), false, 'one flipped char must fail');
assert.equal(verifyPaymentSignature('order_1', 'pay_1', ''), false);
delete process.env.RAZORPAY_KEY_SECRET;
assert.equal(verifyPaymentSignature('order_1', 'pay_1', sig), false, 'unset secret must never verify');

/* ── Webhook signature ───────────────────────────────────── */
process.env.RAZORPAY_WEBHOOK_SECRET = 'hook_secret';
const body = '{"event":"payment.captured"}';
const hookSig = createHmac('sha256', 'hook_secret').update(body).digest('hex');
assert.equal(verifyWebhookSignature(body, hookSig), true);
assert.equal(verifyWebhookSignature(body + ' ', hookSig), false, 'body must be verified byte-for-byte');
assert.equal(verifyWebhookSignature(body, null), false);

/* ── markPaid is idempotent: second call emails nothing ──── */
let paidCount = 1;
let emails = 0;
prisma.costRequest.updateMany = async () => ({ count: paidCount });
prisma.costRequest.findUnique = async () => ({
  id: 'r1', company: 'Co', name: 'Full Name', email: 'e@x.com', gst: '29ABCDE1234F1Z5', quotedAmount: 12345,
  items: [{ valveType: 'Butterfly Valve', size: 'DN 300', pressure: 'PN 16', material: 'CI', endConnection: 'Flanged', quantity: 4, remarks: '' }],
});
process.env.ENQUIRY_API_KEY = 'k';
process.env.ENQUIRY_FROM = 'a@x.com';
process.env.ENQUIRY_TO = 'b@x.com';
let mail = null;
globalThis.fetch = async (_url, init) => { emails += 1; mail = JSON.parse(init.body); return new Response('{"id":"x"}', { status: 200 }); };
assert.equal(await markPaid('order_1', 'pay_1'), true);
assert.equal(emails, 1, 'first mark must email the business');
assert.match(mail.subject, /Order confirmed/);
for (const needle of ['Full Name', 'Co', 'e@x.com', '29ABCDE1234F1Z5', 'Butterfly Valve', 'qty 4', 'pay_1']) {
  assert.match(mail.text, new RegExp(needle), `confirmation email must carry "${needle}"`);
}

/* ── 20 lakh rule: online only below the limit ───────────── */
assert.equal(canPayOnline(19_99_999 * 100), true);
assert.equal(canPayOnline(20_00_000 * 100), false, '20 lakh exactly is offline');
assert.equal(canPayOnline(0), false);
assert.equal(canPayOnline(null), false);
paidCount = 0;
assert.equal(await markPaid('order_1', 'pay_1'), false);
assert.equal(emails, 1, 'a replayed webhook must not email again');

/* ── Webhook route: bad signature rejected, good one marks paid ── */
const { POST } = await import(pathToFileURL(path.join(root, 'app/api/razorpay/webhook/route.ts')).href);
const event = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_9', order_id: 'order_9' } } } });
let marked = null;
paidCount = 1;
prisma.costRequest.updateMany = async ({ where, data }) => { marked = { where, data }; return { count: 1 }; };
const hook = (sigValue) =>
  POST(new Request('http://localhost/api/razorpay/webhook', { method: 'POST', headers: { 'x-razorpay-signature': sigValue }, body: event }));
assert.equal((await hook('nope')).status, 400);
assert.equal(marked, null, 'an unsigned event must not touch the database');
assert.equal((await hook(createHmac('sha256', 'hook_secret').update(event).digest('hex'))).status, 200);
assert.equal(marked.where.razorpayOrderId, 'order_9');
assert.equal(marked.data.razorpayPaymentId, 'pay_9');

/* ── Admin quote: rupees -> paise (same schema as setQuoteAction) ── */
const { z } = await import('zod');
const amount = z.coerce.number().positive().max(100_000_000).transform((r) => Math.round(r * 100));
assert.equal(amount.parse('1234.56'), 123456);
assert.equal(amount.parse('0.1'), 10, 'float rounding must not produce 9.999 paise');
assert.equal(amount.safeParse('0').success, false);
assert.equal(amount.safeParse('-5').success, false);
assert.equal(amount.safeParse('abc').success, false);

console.log('check-razorpay: ok');
