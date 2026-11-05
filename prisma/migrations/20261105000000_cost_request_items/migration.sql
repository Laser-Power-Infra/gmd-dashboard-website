-- AlterTable: cost requests now carry the requested items
ALTER TABLE "cost_requests" ADD COLUMN "items" JSONB NOT NULL DEFAULT '[]';
