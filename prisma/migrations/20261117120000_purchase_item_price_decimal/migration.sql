-- AlterColumn: price was Int paise; now rupees with 2 decimals. Existing values (0) are unaffected.
ALTER TABLE "purchase_item_prices" ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2);
