-- CreateTable
CREATE TABLE "CurrentPost"
(
    "streamerUsername"  TEXT    NOT NULL PRIMARY KEY,
    "telegramChannelId" TEXT    NOT NULL,
    "messageId"         INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Log"
(
    "id"        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    "level"     TEXT     NOT NULL,
    "message"   TEXT     NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);