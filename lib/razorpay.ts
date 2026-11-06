import { createHmac, timingSafeEqual } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { sendEnquiry } from '@/lib/notify';
import { costItemLines } from '@/lib/schemas/cost';

/**
 * Razorpay, with plain fetch + node crypto - no SDK.
 *
 *   RAZORPAY_KEY_ID          public key id (sent to the browser as a prop)
 *   RAZORPAY_KEY_SECRET      signs orders and checkout callbacks; server only
 *   RAZORPAY_WEBHOOK_SECRET  signs webhook bodies; server only
 *
 * The amount is always the paise stored on the CostRequest, never anything
 * the browser sends.
 */

const ENDPOINT = 'https://api.razorpay.com/v1/orders';

/** Quotes of 20 lakh and above are settled offline; only smaller ones get a Pay button. */
export const ONLINE_PAYMENT_LIMIT_PAISE = 20_00_000 * 100;

export function canPayOnline(amountPaise: number | null): amountPaise is number {
  return amountPaise != null && amountPaise > 0 && amountPaise < ONLINE_PAYMENT_LIMIT_PAISE;
}

export function formatRupees(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export function missingRazorpayConfig(): string[] {
  return [
    !process.env.RAZORPAY_KEY_ID && 'RAZORPAY_KEY_ID',
    !process.env.RAZORPAY_KEY_SECRET && 'RAZORPAY_KEY_SECRET',
    !process.env.RAZORPAY_WEBHOOK_SECRET && 'RAZORPAY_WEBHOOK_SECRET',
  ].filter((name): name is string => Boolean(name));
}

/** Creates a Razorpay order and returns its id. Throws on any failure. */
export async function createOrder(amountPaise: number, receipt: string): Promise<string> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) throw new Error('Razorpay is not configured');

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Razorpay order failed: ${response.status} ${await response.text().catch(() => '')}`);
  const order = (await response.json()) as { id?: string };
  if (!order.id) throw new Error('Razorpay order response had no id');
  return order.id;
}

function hmacMatches(secret: string | undefined, payload: string, signature: string | null): boolean {
  if (!secret || !signature) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(payload).digest('hex'));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Checkout handler callback: signature = HMAC(order_id|payment_id, key secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  return hmacMatches(process.env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`, signature);
}

/** Webhook: X-Razorpay-Signature = HMAC(raw body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  return hmacMatches(process.env.RAZORPAY_WEBHOOK_SECRET, rawBody, signature);
}

/**
 * Marks the request behind a Razorpay order as paid. Idempotent: the checkout
 * callback and the webhook both call it, only the first one emails.
 */
export async function markPaid(orderId: string, paymentId: string): Promise<boolean> {
  const { count } = await prisma.costRequest.updateMany({
    where: { razorpayOrderId: orderId, status: { not: 'PAID' } },
    data: { status: 'PAID', razorpayPaymentId: paymentId, paidAt: new Date() },
  });
  if (count === 0) return false;

  const row = await prisma.costRequest.findUnique({ where: { razorpayOrderId: orderId } });
  if (row) {
    const items = costItemLines(row.items);
    await sendEnquiry(
      `Order confirmed: ${formatRupees(row.quotedAmount ?? 0)} paid - ${row.company}`,
      [
        'This order is confirmed. The customer paid the quoted amount online via Razorpay.',
        '',
        'Customer',
        `  Full name: ${row.name}`,
        `  Company:   ${row.company}`,
        `  Email:     ${row.email}`,
        `  GSTIN:     ${row.gst}`,
        '',
        `Items (${items.length})`,
        ...items.map((line, n) => `  ${n + 1}. ${line}`),
        '',
        'Payment',
        `  Amount:     ${formatRupees(row.quotedAmount ?? 0)}`,
        `  Payment id: ${paymentId}`,
        `  Order id:   ${orderId}`,
        `  Request id: ${row.id}`,
        `  Paid:       ${new Date().toISOString()}`,
      ].join('\n')
    );
  }
  return true;
}
