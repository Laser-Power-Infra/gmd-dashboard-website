'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { confirmPayment, startPayment } from '@/app/cost/actions';

type RazorpayCheckout = new (options: Record<string, unknown>) => { open(): void };
declare global {
  interface Window {
    Razorpay?: RazorpayCheckout;
  }
}

let checkoutScript: Promise<void> | undefined;
function loadCheckout(): Promise<void> {
  checkoutScript ??= new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    s.onerror = () => {
      checkoutScript = undefined;
      reject(new Error('Could not load Razorpay checkout'));
    };
    document.body.appendChild(s);
  });
  return checkoutScript;
}

/** "Pay ₹X" on the customer's own QUOTED cost request. */
export default function PayButton({ costRequestId, amountPaise }: { costRequestId: string; amountPaise: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function pay() {
    setPending(true);
    try {
      const [order] = await Promise.all([startPayment(costRequestId), loadCheckout()]);
      if (!order.ok) throw new Error(order.message);
      const Razorpay = window.Razorpay;
      if (!Razorpay) throw new Error('Razorpay checkout is unavailable');
      new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: 'INR',
        order_id: order.orderId,
        name: 'GM Dalui',
        description: 'Cost request payment',
        prefill: order.prefill,
        modal: { ondismiss: () => setPending(false) },
        handler: async (res: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const result = await confirmPayment({
            orderId: res.razorpay_order_id,
            paymentId: res.razorpay_payment_id,
            signature: res.razorpay_signature,
          });
          if (result.ok) toast.success('Payment received. Thank you!');
          else toast.error(result.message);
          setPending(false);
          router.refresh();
        },
      }).open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Payment could not be started');
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={pay}
      disabled={pending}
      className="rounded-md bg-[#7b3e41] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#8a4f50] disabled:opacity-60"
    >
      {pending ? 'Opening' : `Pay ₹${(amountPaise / 100).toLocaleString('en-IN')}`}
    </button>
  );
}
