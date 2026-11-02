-- CreateTable
CREATE TABLE "enquiries" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "mailed" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enquiries_createdAt_idx" ON "enquiries"("createdAt");

-- CreateIndex
CREATE INDEX "enquiries_email_idx" ON "enquiries"("email");

