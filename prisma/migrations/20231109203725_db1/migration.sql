-- CreateTable
CREATE TABLE "tb_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dtregister" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastchange" DATETIME NOT NULL,
    "userchange" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "tb_user_permission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sunday" BOOLEAN NOT NULL DEFAULT false,
    "monday" BOOLEAN NOT NULL DEFAULT false,
    "tuesday" BOOLEAN NOT NULL DEFAULT false,
    "wednesday" BOOLEAN NOT NULL DEFAULT false,
    "thursday" BOOLEAN NOT NULL DEFAULT false,
    "friday" BOOLEAN NOT NULL DEFAULT false,
    "saturday" BOOLEAN NOT NULL DEFAULT false,
    "start" DATETIME NOT NULL,
    "finish" DATETIME NOT NULL,
    CONSTRAINT "tb_user_permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_login_key" ON "tb_user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_login_password_key" ON "tb_user"("login", "password");
