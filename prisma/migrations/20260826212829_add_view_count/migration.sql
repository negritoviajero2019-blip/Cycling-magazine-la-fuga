-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "heroImageId" INTEGER,
    "imageCredit" TEXT,
    "imageAlt" TEXT,
    "sourceUrls" TEXT,
    "sourceNames" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "breakingNews" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'es',
    "readingTime" INTEGER NOT NULL DEFAULT 1,
    "confidenceScore" INTEGER,
    "editorialNotes" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Article" ("authorId", "breakingNews", "canonicalUrl", "categoryId", "confidenceScore", "content", "createdAt", "editorialNotes", "excerpt", "featured", "heroImageId", "id", "imageAlt", "imageCredit", "language", "publishedAt", "readingTime", "seoDescription", "seoTitle", "slug", "sourceNames", "sourceUrls", "status", "subtitle", "title", "updatedAt") SELECT "authorId", "breakingNews", "canonicalUrl", "categoryId", "confidenceScore", "content", "createdAt", "editorialNotes", "excerpt", "featured", "heroImageId", "id", "imageAlt", "imageCredit", "language", "publishedAt", "readingTime", "seoDescription", "seoTitle", "slug", "sourceNames", "sourceUrls", "status", "subtitle", "title", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");
CREATE INDEX "Article_categoryId_idx" ON "Article"("categoryId");
CREATE INDEX "Article_breakingNews_idx" ON "Article"("breakingNews");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
