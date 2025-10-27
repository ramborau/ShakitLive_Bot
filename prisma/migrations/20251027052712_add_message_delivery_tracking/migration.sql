-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "threadId" TEXT NOT NULL,
    "senderSsid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "isFromBot" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrichmentStatus" TEXT NOT NULL DEFAULT 'pending',
    "metadata" TEXT,
    "deliveryStatus" TEXT NOT NULL DEFAULT 'pending',
    "facebookMessageId" TEXT,
    "failureReason" TEXT,
    "failureDetails" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" DATETIME,
    "deliveredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_senderSsid_fkey" FOREIGN KEY ("senderSsid") REFERENCES "User" ("ssid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "enrichmentStatus", "id", "isFromBot", "messageType", "metadata", "senderSsid", "threadId", "timestamp") SELECT "content", "createdAt", "enrichmentStatus", "id", "isFromBot", "messageType", "metadata", "senderSsid", "threadId", "timestamp" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE INDEX "Message_threadId_idx" ON "Message"("threadId");
CREATE INDEX "Message_senderSsid_idx" ON "Message"("senderSsid");
CREATE INDEX "Message_timestamp_idx" ON "Message"("timestamp");
CREATE INDEX "Message_deliveryStatus_idx" ON "Message"("deliveryStatus");
CREATE INDEX "Message_isFromBot_idx" ON "Message"("isFromBot");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
