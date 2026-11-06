-- AlterTable: admin quote (paise) and the Razorpay order/payment that settles it
ALTER TABLE "cost_requests" ADD COLUMN "quotedAmount" INTEGER,
ADD COLUMN "razorpayOrderId" TEXT,
ADD COLUMN "razorpayPaymentId" TEXT,
ADD COLUMN "paidAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "cost_requests_razorpayOrderId_key" ON "cost_requests"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "cost_requests_razorpayPaymentId_key" ON "cost_requests"("razorpayPaymentId");
