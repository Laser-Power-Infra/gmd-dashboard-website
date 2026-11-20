import 'server-only';

import { planPriceUpdates, type CostEntry } from '@/app/purchase/priceSnapshot';
import { prisma } from '@/lib/prisma';

/**
 * Applies one full cost snapshot from gmd-quotation to PurchaseItemPrice.
 * Writes only rows whose price changed. Never touches imageUrl or metadata.
 */
export async function applyPriceSnapshot(snapshot: CostEntry[]) {
  // An empty snapshot would turn every item into "Price on request"; that is a
  // broken sender, not a real price list.
  if (snapshot.length === 0) throw new Error('Empty cost snapshot - refusing to clear every price');

  const rows = await prisma.purchaseItemPrice.findMany({ select: { id: true, itemCode: true, price: true } });
  const { updates, priced, onRequest } = planPriceUpdates(
    rows.map((r) => ({ id: r.id, itemCode: r.itemCode, price: r.price == null ? null : Number(r.price) })),
    snapshot
  );

  // One statement, one round trip: per-row updates over Neon took minutes on the
  // first fill and the sender timed out. Raw SQL skips @updatedAt, so set it here.
  if (updates.length > 0) {
    await prisma.$executeRaw`
      UPDATE "purchase_item_prices" AS p
      SET "price" = v.price, "updatedAt" = now()
      FROM unnest(${updates.map((u) => u.id)}::text[], ${updates.map((u) => u.price)}::numeric[]) AS v(id, price)
      WHERE p."id" = v.id`;
  }

  const result = { total: rows.length, priced, onRequest, changed: updates.length, received: snapshot.length };
  console.log('[price-sync] applied', result);
  return result;
}
