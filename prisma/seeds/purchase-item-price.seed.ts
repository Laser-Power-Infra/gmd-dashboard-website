// PurchaseItemPrice seed: one row per listed /purchase item (itemCode + cleaned name), price 0 = not priced yet.
// Run: npx tsx --env-file=.env prisma/seeds/purchase-item-price.seed.ts
import fs from "node:fs";
import path from "node:path";
import { buildStock } from "../../app/purchase/catalog";
import { prisma } from "../../lib/prisma";

async function main() {
  const rows = JSON.parse(fs.readFileSync(path.join(__dirname, "../../public/purchaseItems.json"), "utf8"));
  const data = buildStock(rows).map((i) => ({ itemCode: i.itemCode, itemName: i.name, price: 0 }));
  // skipDuplicates: a re-run only adds new items, it never resets a price set since.
  const { count } = await prisma.purchaseItemPrice.createMany({ data, skipDuplicates: true });
  console.log(`inserted ${count} of ${data.length}; table now holds ${await prisma.purchaseItemPrice.count()}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
