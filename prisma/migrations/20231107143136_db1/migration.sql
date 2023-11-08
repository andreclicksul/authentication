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

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_login_key" ON "tb_user"("login");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_login_password_key" ON "tb_user"("login", "password");
