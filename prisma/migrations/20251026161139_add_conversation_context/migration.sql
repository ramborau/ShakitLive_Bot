-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Thread" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lastActivity" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "currentFlow" TEXT,
    "flowStep" TEXT,
    "flowData" TEXT,
    "intent" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "needsHuman" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Thread" ("createdAt", "id", "lastActivity", "lastMessage", "updatedAt") SELECT "createdAt", "id", "lastActivity", "lastMessage", "updatedAt" FROM "Thread";
DROP TABLE "Thread";
ALTER TABLE "new_Thread" RENAME TO "Thread";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
