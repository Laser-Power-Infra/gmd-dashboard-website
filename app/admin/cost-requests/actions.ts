'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { isElevatedRole } from '@/lib/auth/require-auth';

export type QuoteFormState = { ok: boolean; message?: string };

/** Rupees typed by an admin -> paise stored on the row. */
const quoteSchema = z.object({
  id: z.string().min(1),
  amount: z.coerce
    .number({ message: 'Enter an amount' })
    .positive({ message: 'Amount must be more than 0' })
    .max(100_000_000, { message: 'Amount is too large' })
    .transform((rupees) => Math.round(rupees * 100)),
});

/**
 * ADMIN/DEVELOPER sets the quote on a cost request. Re-quoting drops the
 * Razorpay order (its amount is fixed); a paid request cannot be re-quoted.
 */
export async function setQuoteAction(_prev: QuoteFormState, formData: FormData): Promise<QuoteFormState> {
  const caller = await getCurrentUser();
  if (!caller || !isElevatedRole(caller.role)) return { ok: false, message: 'Forbidden' };

  const parsed = quoteSchema.safeParse({ id: formData.get('id'), amount: formData.get('amount') });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Invalid amount' };

  const { count } = await prisma.costRequest.updateMany({
    where: { id: parsed.data.id, status: { not: 'PAID' } },
    data: { quotedAmount: parsed.data.amount, status: 'QUOTED', razorpayOrderId: null },
  });
  if (count === 0) return { ok: false, message: 'Request not found or already paid' };

  revalidatePath('/admin/cost-requests');
  return { ok: true, message: 'Quote saved' };
}
