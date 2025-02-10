-- CreateTable
CREATE TABLE "SystemMetrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpuUsage" REAL NOT NULL,
    "memoryTotal" BIGINT NOT NULL,
    "memoryUsed" BIGINT NOT NULL,
    "memoryFree" BIGINT NOT NULL,
    "uptime" BIGINT NOT NULL,
    "activeConnections" INTEGER NOT NULL,
    "requestsPerMinute" INTEGER NOT NULL,
    "averageResponseTime" REAL NOT NULL,
    "errorRate" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ErrorLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" TEXT
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "referrer" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "pages" TEXT NOT NULL,
    "bounced" BOOLEAN NOT NULL DEFAULT true,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

-- CreateTable
CREATE TABLE "ApiRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "path" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "userId" TEXT,
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL
);

-- CreateIndex
CREATE INDEX "SystemMetrics_timestamp_idx" ON "SystemMetrics"("timestamp");
CREATE INDEX "ErrorLog_timestamp_idx" ON "ErrorLog"("timestamp");
CREATE INDEX "ErrorLog_level_idx" ON "ErrorLog"("level");
CREATE INDEX "UserActivity_userId_idx" ON "UserActivity"("userId");
CREATE INDEX "UserActivity_timestamp_idx" ON "UserActivity"("timestamp");
CREATE INDEX "PageView_userId_idx" ON "PageView"("userId");
CREATE INDEX "PageView_timestamp_idx" ON "PageView"("timestamp");
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");
CREATE INDEX "UserSession_startTime_idx" ON "UserSession"("startTime");
CREATE INDEX "ApiRequest_timestamp_idx" ON "ApiRequest"("timestamp");
CREATE INDEX "ApiRequest_userId_idx" ON "ApiRequest"("userId");
