-- Drop old structure
DROP TABLE IF EXISTS "questions" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;

-- CreateTable Subject
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");
CREATE UNIQUE INDEX "subjects_slug_key" ON "subjects"("slug");

-- CreateTable Topic
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "topics_subjectId_slug_key" ON "topics"("subjectId", "slug");

ALTER TABLE "topics"
  ADD CONSTRAINT "topics_subjectId_fkey"
  FOREIGN KEY ("subjectId") REFERENCES "subjects"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable Question
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "incorrectAnswers" TEXT[],
    "difficulty" "Difficulty" NOT NULL DEFAULT 'easy',
    "status" "QuestionStatus" NOT NULL DEFAULT 'pending',
    "topicId" TEXT NOT NULL,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "submittedBy" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "questions_status_idx" ON "questions"("status");
CREATE INDEX "questions_topicId_idx" ON "questions"("topicId");

ALTER TABLE "questions"
  ADD CONSTRAINT "questions_topicId_fkey"
  FOREIGN KEY ("topicId") REFERENCES "topics"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "questions"
  ADD CONSTRAINT "questions_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
