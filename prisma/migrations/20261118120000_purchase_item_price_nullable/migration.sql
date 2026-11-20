-- AlterColumn: price may be unknown. null = no RawMaterial.cost yet ("Price on request").
ALTER TABLE "purchase_item_prices" ALTER COLUMN "price" DROP NOT NULL;
