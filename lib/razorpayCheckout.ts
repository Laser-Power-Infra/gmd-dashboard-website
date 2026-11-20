'use client';

import { confirmPayment } from '@/app/cost/actions';

type RazorpayCheckout = new (options: Record<string, unknown>) => { open(): void };
declare global {
  interface Window {
    Razorpay?: RazorpayCheckout;
  }
}

let checkoutScript: Promise<void> | undefined;
export function loadCheckout(): Promise<void> {
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

export type CheckoutOrder = {
  orderId: string;
  amount: number;
  keyId: string;
  prefill: { name: string; email: string };
};

/**
 * Opens Razorpay checkout for an order the server created, and verifies the
 * payment server-side (confirmPayment) when Razorpay reports success.
 * Resolves 'paid', 'failed' (with a message) or 'dismissed'. Load the script
 * with loadCheckout() first.
 */
export function openRazorpayCheckout(
  order: CheckoutOrder,
  description: string
): Promise<{ status: 'paid' } | { status: 'failed'; message: string } | { status: 'dismissed' }> {
  return new Promise((resolve) => {
    const Razorpay = window.Razorpay;
    if (!Razorpay) return resolve({ status: 'failed', message: 'Razorpay checkout is unavailable' });
    new Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: 'INR',
      order_id: order.orderId,
      name: 'GM Dalui',
      description,
      prefill: order.prefill,
      modal: { ondismiss: () => resolve({ status: 'dismissed' }) },
      handler: async (res: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const result = await confirmPayment({
          orderId: res.razorpay_order_id,
          paymentId: res.razorpay_payment_id,
          signature: res.razorpay_signature,
        });
        resolve(result.ok ? { status: 'paid' } : { status: 'failed', message: result.message });
      },
    }).open();
  });
}
