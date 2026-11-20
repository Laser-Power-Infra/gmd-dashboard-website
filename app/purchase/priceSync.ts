import 'server-only';

import { planPriceUpdates, type CostEntry } from '@/app/purchase/priceSnapshot';
import { prisma } from '@/lib/prisma';

const BATCH = 100;

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

  for (let n = 0; n < updates.length; n += BATCH) {
    await prisma.$transaction(
      updates
        .slice(n, n + BATCH)
        .map((u) => prisma.purchaseItemPrice.update({ where: { id: u.id }, data: { price: u.price } })),
      { timeout: 60_000 } // 100 updates over Neon's network exceed the 5s default
    );
  }

  const result = { total: rows.length, priced, onRequest, changed: updates.length, received: snapshot.length };
  console.log('[price-sync] applied', result);
  return result;
}
