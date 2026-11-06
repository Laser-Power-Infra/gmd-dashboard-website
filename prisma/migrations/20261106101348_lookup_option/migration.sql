-- CreateTable
CREATE TABLE "LookupOption" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "code" TEXT,
    "defaultState" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LookupOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LookupOption_code_key" ON "LookupOption"("code");

-- CreateIndex
CREATE INDEX "LookupOption_type_isActive_idx" ON "LookupOption"("type", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "LookupOption_type_value_key" ON "LookupOption"("type", "value");
