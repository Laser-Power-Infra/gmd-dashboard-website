'use server';

import { resolveStockLines } from '@/app/purchase/data';
import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { canPayOnline, createOrder } from '@/lib/razorpay';
import { purchaseLinesSchema } from '@/lib/schemas/cost';

/**
 * "Buy Now" on the /purchase list. Prices come from PurchaseItemPrice, never
 * from the browser; the total must be under the online limit (20 lakh).
 *
 * The list is saved as a CostRequest already QUOTED at that total, with one
 * Razorpay order. From here it is the /cost payment flow: confirmPayment or
 * the webhook calls markPaid, and an abandoned checkout stays payable on /cost.
 */
export async function startPurchase(input: unknown): Promise<
  | { ok: true; orderId: string; amount: number; keyId: string; prefill: { name: string; email: string } }
  | { ok: false; message: string }
> {
  const session = await getCurrentUser();
  if (!session) return { ok: false, message: 'Please sign in to buy.' };
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) return { ok: false, message: 'Online payment is not available right now. Please request a quote.' };

  const parsed = purchaseLinesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid list.' };

  const { lines, unknown } = await resolveStockLines(parsed.data);
  if (unknown.length > 0) return { ok: false, message: `Unknown item code(s): ${unknown.join(', ')}` };
  if (lines.some((l) => l.unitPrice == null || l.unitPrice <= 0)) {
    return { ok: false, message: 'Some items have no price yet. Please request a quote.' };
  }

  // Paise per unit rounded once, so the charge is exactly the sum the customer saw.
  const amount = lines.reduce((sum, l) => sum + Math.round(l.unitPrice! * 100) * l.quantity, 0);
  if (!canPayOnline(amount)) {
    return { ok: false, message: 'Orders of 20 lakh and above are quoted offline. Please request a quote.' };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { name: true, email: true, company: true, gstNumber: true },
  });
  if (!user) return { ok: false, message: 'Please sign in to buy.' };
  const name = user.name ?? user.email;

  const row = await prisma.costRequest.create({
    data: {
      name,
      company: user.company ?? '',
      email: user.email,
      gst: user.gstNumber ?? '',
      items: lines,
      userId: session.id,
      status: 'QUOTED',
      quotedAmount: amount,
    },
  });

  try {
    const orderId = await createOrder(amount, row.id);
    await prisma.costRequest.update({ where: { id: row.id }, data: { razorpayOrderId: orderId } });
    return { ok: true, orderId, amount, keyId, prefill: { name, email: user.email } };
  } catch (err) {
    console.error('Razorpay order failed for Buy Now:', err);
    // No order means nothing to pay; drop the row rather than leave a dead QUOTED request.
    await prisma.costRequest.delete({ where: { id: row.id } }).catch(() => {});
    return { ok: false, message: 'Could not start the payment. Please try again.' };
  }
}
