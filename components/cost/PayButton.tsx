'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { startPayment } from '@/app/cost/actions';
import { loadCheckout, openRazorpayCheckout } from '@/lib/razorpayCheckout';

/** "Pay ₹X" on the customer's own QUOTED cost request. */
export default function PayButton({
  costRequestId,
  amountPaise,
  className,
}: {
  costRequestId: string;
  amountPaise: number;
  /** Replaces the default styling (used by the /cost orders list). */
  className?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function pay() {
    setPending(true);
    try {
      const [order] = await Promise.all([startPayment(costRequestId), loadCheckout()]);
      if (!order.ok) throw new Error(order.message);
      const result = await openRazorpayCheckout(order, 'Cost request payment');
      if (result.status === 'paid') toast.success('Payment received. Thank you!');
      else if (result.status === 'failed') toast.error(result.message);
      if (result.status !== 'dismissed') router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment could not be started');
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={pay}
      disabled={pending}
      className={
        className ??
        'h-9 rounded-lg bg-[#7b3e41] px-4 text-sm font-semibold text-white transition-transform duration-100 hover:bg-[#8a4f50] active:scale-[0.97] disabled:opacity-60 motion-reduce:active:scale-100'
      }
    >
      {pending ? 'Opening' : `Pay ₹${(amountPaise / 100).toLocaleString('en-IN')}`}
    </button>
  );
}
