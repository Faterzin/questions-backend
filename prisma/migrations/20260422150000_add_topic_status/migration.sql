-- CreateEnum
CREATE TYPE "TopicStatus" AS ENUM ('pending', 'approved');

-- AlterTable
ALTER TABLE "topics"
  ADD COLUMN "status" "TopicStatus" NOT NULL DEFAULT 'approved';

-- CreateIndex
CREATE INDEX "topics_status_idx" ON "topics"("status");
