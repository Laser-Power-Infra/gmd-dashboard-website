import { markPaid, verifyWebhookSignature } from '@/lib/razorpay';

/**
 * POST /api/razorpay/webhook - backstop for payments whose checkout callback
 * never reached us (closed tab, lost network). Razorpay retries non-2xx, so a
 * verified event is always answered 200 even when it is not one we act on.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get('x-razorpay-signature'))) {
    return new Response('bad signature', { status: 400 });
  }

  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response('bad json', { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  if (event.event === 'payment.captured' && payment?.id && payment.order_id) {
    await markPaid(payment.order_id, payment.id);
  }
  return new Response('ok');
}
