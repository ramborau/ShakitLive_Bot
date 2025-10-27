-- CreateTable
CREATE TABLE "FAQ" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "faqId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "questionTl" TEXT NOT NULL,
    "answerTl" TEXT NOT NULL,
    "questionTag" TEXT NOT NULL,
    "answerTag" TEXT NOT NULL,
    "searchKeywords" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "QA" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questionEn" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "questionTl" TEXT NOT NULL,
    "answerTl" TEXT NOT NULL,
    "questionTag" TEXT NOT NULL,
    "answerTag" TEXT NOT NULL,
    "searchKeywords" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "FAQ_category_idx" ON "FAQ"("category");

-- CreateIndex
CREATE INDEX "FAQ_faqId_idx" ON "FAQ"("faqId");
