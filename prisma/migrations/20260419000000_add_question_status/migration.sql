-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "questions"
  ADD COLUMN "status" "QuestionStatus" NOT NULL DEFAULT 'pending',
  ADD COLUMN "submittedBy" TEXT;

-- CreateIndex
CREATE INDEX "questions_status_idx" ON "questions"("status");
