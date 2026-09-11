-- CreateTable
CREATE TABLE "Article" (
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
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_heroImageId_fkey" FOREIGN KEY ("heroImageId") REFERENCES "Media" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArticleRevision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "articleId" INTEGER NOT NULL,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "summary" TEXT NOT NULL,
    "editor" TEXT,
    CONSTRAINT "ArticleRevision_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'generic',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Author" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "specialty" TEXT,
    "isAiAssisted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Race" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "edition" INTEGER,
    "year" INTEGER NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "country" TEXT,
    "category" TEXT NOT NULL,
    "numStages" INTEGER,
    "distanceKm" REAL,
    "status" TEXT NOT NULL DEFAULT 'upcoming',
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Stage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "startCity" TEXT,
    "endCity" TEXT,
    "distanceKm" REAL,
    "type" TEXT,
    "profileNotes" TEXT,
    CONSTRAINT "Stage_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rider" (
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
    CONSTRAINT "Rider_currentTeamId_fkey" FOREIGN KEY ("currentTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "category" TEXT NOT NULL,
    "logoUrl" TEXT,
    "sponsors" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Result" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "raceId" INTEGER NOT NULL,
    "stageId" INTEGER,
    "riderId" INTEGER,
    "teamId" INTEGER,
    "position" INTEGER,
    "time" TEXT,
    "points" INTEGER,
    "date" DATETIME NOT NULL,
    "resultType" TEXT NOT NULL,
    CONSTRAINT "Result_raceId_fkey" FOREIGN KEY ("raceId") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Result_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Result_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Result_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "riderId" INTEGER NOT NULL,
    "fromTeamId" INTEGER,
    "toTeamId" INTEGER NOT NULL,
    "announcedDate" DATETIME NOT NULL,
    "effectiveDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'rumor',
    "sourceUrls" TEXT,
    CONSTRAINT "Transfer_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transfer_fromTeamId_fkey" FOREIGN KEY ("fromTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Transfer_toTeamId_fkey" FOREIGN KEY ("toTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "credibilityTier" TEXT,
    "firstSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "author" TEXT,
    "license" TEXT,
    "credit" TEXT,
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NewsletterSubscriber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "consentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "provider" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'editor',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CronExecution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobName" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'running',
    "itemsFound" INTEGER,
    "articlesCreated" INTEGER,
    "errorLog" TEXT
);

-- CreateTable
CREATE TABLE "NewsCandidate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sourceUrls" TEXT NOT NULL,
    "sourceNames" TEXT NOT NULL,
    "detectedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventDate" DATETIME,
    "category" TEXT,
    "entities" TEXT,
    "relevanceScore" INTEGER,
    "confidenceScore" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'new',
    "duplicateOfId" INTEGER,
    "reviewNotes" TEXT,
    "editorialAction" TEXT,
    "createdArticleId" INTEGER
);

-- CreateTable
CREATE TABLE "_ArticleToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ArticleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArticleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ArticleToRider" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ArticleToRider_A_fkey" FOREIGN KEY ("A") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArticleToRider_B_fkey" FOREIGN KEY ("B") REFERENCES "Rider" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ArticleToTeam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ArticleToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArticleToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ArticleToRace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ArticleToRace_A_fkey" FOREIGN KEY ("A") REFERENCES "Article" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ArticleToRace_B_fkey" FOREIGN KEY ("B") REFERENCES "Race" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Article_categoryId_idx" ON "Article"("categoryId");

-- CreateIndex
CREATE INDEX "Article_breakingNews_idx" ON "Article"("breakingNews");

-- CreateIndex
CREATE INDEX "ArticleRevision_articleId_idx" ON "ArticleRevision"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Race_slug_key" ON "Race"("slug");

-- CreateIndex
CREATE INDEX "Race_year_status_idx" ON "Race"("year", "status");

-- CreateIndex
CREATE INDEX "Stage_raceId_number_idx" ON "Stage"("raceId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "Rider_slug_key" ON "Rider"("slug");

-- CreateIndex
CREATE INDEX "Rider_currentTeamId_idx" ON "Rider"("currentTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "Team"("slug");

-- CreateIndex
CREATE INDEX "Result_raceId_resultType_idx" ON "Result"("raceId", "resultType");

-- CreateIndex
CREATE INDEX "Transfer_riderId_idx" ON "Transfer"("riderId");

-- CreateIndex
CREATE INDEX "Transfer_status_idx" ON "Transfer"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterSubscriber_email_key" ON "NewsletterSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "CronExecution_jobName_startedAt_idx" ON "CronExecution"("jobName", "startedAt");

-- CreateIndex
CREATE INDEX "NewsCandidate_status_idx" ON "NewsCandidate"("status");

-- CreateIndex
CREATE INDEX "NewsCandidate_detectedAt_idx" ON "NewsCandidate"("detectedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON "_ArticleToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToTag_B_index" ON "_ArticleToTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToRider_AB_unique" ON "_ArticleToRider"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToRider_B_index" ON "_ArticleToRider"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTeam_AB_unique" ON "_ArticleToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToTeam_B_index" ON "_ArticleToTeam"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToRace_AB_unique" ON "_ArticleToRace"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToRace_B_index" ON "_ArticleToRace"("B");
