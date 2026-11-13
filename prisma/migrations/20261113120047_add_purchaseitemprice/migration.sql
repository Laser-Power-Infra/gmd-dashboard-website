-- CreateTable
CREATE TABLE "purchase_item_prices" (
    "id" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_item_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "purchase_item_prices_itemCode_itemName_key" ON "purchase_item_prices"("itemCode", "itemName");
