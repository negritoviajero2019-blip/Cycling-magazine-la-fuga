-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "nationality" TEXT,
    "birthDate" DATETIME,
    "currentTeamId" INTEGER,
    "specialty" TEXT,
    "bio" TEXT,
    "stats" TEXT,
    "weightKg" REAL,
    "education" TEXT,
    "achievements" TEXT,
    "photoCredit" TEXT,
    "photoSourceUrl" TEXT,
    "profileVerifiedAt" DATETIME,
    "uciRanking" INTEGER,
    "isRetired" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Rider_currentTeamId_fkey" FOREIGN KEY ("currentTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Rider" ("achievements", "bio", "birthDate", "currentTeamId", "education", "id", "name", "nationality", "photoCredit", "photoSourceUrl", "photoUrl", "profileVerifiedAt", "slug", "specialty", "stats", "weightKg") SELECT "achievements", "bio", "birthDate", "currentTeamId", "education", "id", "name", "nationality", "photoCredit", "photoSourceUrl", "photoUrl", "profileVerifiedAt", "slug", "specialty", "stats", "weightKg" FROM "Rider";
DROP TABLE "Rider";
ALTER TABLE "new_Rider" RENAME TO "Rider";
CREATE UNIQUE INDEX "Rider_slug_key" ON "Rider"("slug");
CREATE INDEX "Rider_currentTeamId_idx" ON "Rider"("currentTeamId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
