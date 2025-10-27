-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "ssid" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "profilePic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentFlow" TEXT,
    "flowStep" TEXT,
    "flowData" TEXT,
    "intent" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "needsHuman" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThreadParticipant" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreadParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderSsid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "isFromBot" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrichmentStatus" TEXT NOT NULL DEFAULT 'pending',
    "metadata" TEXT,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
    "facebookMessageId" TEXT,
    "failureReason" TEXT,
    "failureDetails" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenLog" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "generated" INTEGER NOT NULL,
    "expiresAt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" SERIAL NOT NULL,
    "faqId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "questionTl" TEXT NOT NULL,
    "answerTl" TEXT NOT NULL,
    "questionTag" TEXT NOT NULL,
    "answerTag" TEXT NOT NULL,
    "searchKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QA" (
    "id" SERIAL NOT NULL,
    "questionEn" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "questionTl" TEXT NOT NULL,
    "answerTl" TEXT NOT NULL,
    "questionTag" TEXT NOT NULL,
    "answerTag" TEXT NOT NULL,
    "searchKeywords" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ssid_key" ON "User"("ssid");

-- CreateIndex
CREATE INDEX "ThreadParticipant_threadId_idx" ON "ThreadParticipant"("threadId");

-- CreateIndex
CREATE INDEX "ThreadParticipant_userId_idx" ON "ThreadParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ThreadParticipant_threadId_userId_key" ON "ThreadParticipant"("threadId", "userId");

-- CreateIndex
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");

-- CreateIndex
CREATE INDEX "Message_senderSsid_idx" ON "Message"("senderSsid");

-- CreateIndex
CREATE INDEX "Message_timestamp_idx" ON "Message"("timestamp");

-- CreateIndex
CREATE INDEX "Message_deliveryStatus_idx" ON "Message"("deliveryStatus");

-- CreateIndex
CREATE INDEX "Message_isFromBot_idx" ON "Message"("isFromBot");

-- CreateIndex
CREATE INDEX "FAQ_category_idx" ON "FAQ"("category");

-- CreateIndex
CREATE INDEX "FAQ_faqId_idx" ON "FAQ"("faqId");

-- AddForeignKey
ALTER TABLE "ThreadParticipant" ADD CONSTRAINT "ThreadParticipant_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreadParticipant" ADD CONSTRAINT "ThreadParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderSsid_fkey" FOREIGN KEY ("senderSsid") REFERENCES "User"("ssid") ON DELETE RESTRICT ON UPDATE CASCADE;
