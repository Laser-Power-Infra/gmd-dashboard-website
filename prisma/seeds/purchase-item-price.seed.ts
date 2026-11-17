// PurchaseItemPrice spec backfill: parses each item's name into type/size/pressure/moc and stores them
// in metadata, so /purchase can filter and paginate in the database. Touches only metadata - never
// price or imageUrl. Safe to re-run; run it again after adding items.
// (The original rows came from public/purchaseItems.json, now deleted - see git history.)
// Run: npx tsx --env-file=.env prisma/seeds/purchase-item-price.seed.ts
import { filterableSpecs } from "../../app/purchase/catalog";
import { prisma } from "../../lib/prisma";

const BATCH = 100;

async function main() {
  const rows = await prisma.purchaseItemPrice.findMany({ select: { id: true, itemName: true, metadata: true } });

  for (let n = 0; n < rows.length; n += BATCH) {
    await prisma.$transaction(
      rows.slice(n, n + BATCH).map((r) =>
        prisma.purchaseItemPrice.update({
          where: { id: r.id },
          data: { metadata: { ...(r.metadata as object), ...filterableSpecs(r.itemName) } },
        })
      ),
      { timeout: 60_000 } // 100 updates over Neon's network exceed the 5s default
    );
  }
  console.log(`specs written to ${rows.length} rows`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
