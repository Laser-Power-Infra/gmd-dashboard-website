import { timingSafeEqual } from 'node:crypto';
import { z } from 'zod';

import { applyPriceSnapshot } from '@/app/purchase/priceSync';

/**
 * POST /api/purchase-prices/sync
 *
 * Receives the hourly full cost snapshot from gmd-quotation
 * (schedular_function/website-prices.ts): every RawMaterial erpItemCode with its
 * cost in rupees. Catalogue items are matched on itemCode; a positive cost
 * becomes the price, anything else becomes "Price on request".
 * Gated by the `x-api-key` header, which must equal PRICE_SYNC_API_KEY.
 *
 *   body: { costs: { erpItemCode: string, cost: number | null }[] }
 *   200 { ok, total, priced, onRequest, changed, received }
 *   400 bad/empty body | 401 bad key | 503 key unset | 500 apply failed
 *
 * GET with a valid key is the credential probe the ofelia script runs first;
 * it changes nothing.
 */
export const dynamic = 'force-dynamic';

const schema = z.object({
  costs: z
    .array(
      z.object({
        erpItemCode: z.string().trim().min(1).max(60),
        cost: z.number().finite().nonnegative().nullable(),
      })
    )
    .min(1, 'Snapshot is empty')
    .max(50_000),
});

/** null when the key is valid, otherwise the response to send. */
function checkKey(request: Request): Response | null {
  const expected = process.env.PRICE_SYNC_API_KEY;
  if (!expected) return Response.json({ error: 'Price sync not configured' }, { status: 503 });
  const a = Buffer.from(request.headers.get('x-api-key') ?? '');
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  return checkKey(request) ?? Response.json({ auth: 'ok', job: 'purchase-prices' });
}

export async function POST(request: Request) {
  const denied = checkKey(request);
  if (denied) return denied;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: 'Invalid body', issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
  }

  try {
    const result = await applyPriceSnapshot(parsed.data.costs);
    return Response.json({ ok: true, ...result });
  } catch (e) {
    console.error('[price-sync] failed', e);
    return Response.json({ error: 'Price sync failed' }, { status: 500 });
  }
}
