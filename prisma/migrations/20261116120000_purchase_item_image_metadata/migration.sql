-- AlterTable
ALTER TABLE "purchase_item_prices" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
