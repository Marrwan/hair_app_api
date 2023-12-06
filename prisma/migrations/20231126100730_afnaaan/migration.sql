/*
  Warnings:

  - You are about to drop the `Notifications_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notifications_settings" DROP CONSTRAINT "Notifications_settings_userId_fkey";

-- DropTable
DROP TABLE "Notifications_settings";

-- CreateTable
CREATE TABLE "Notification_settings" (
    "id" SERIAL NOT NULL,
    "appointment" BOOLEAN NOT NULL DEFAULT true,
    "push" BOOLEAN NOT NULL DEFAULT false,
    "ring_out" BOOLEAN NOT NULL DEFAULT false,
    "vibrate" BOOLEAN NOT NULL DEFAULT true,
    "new_stylist" BOOLEAN NOT NULL DEFAULT false,
    "new_products" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_settings_userId_key" ON "Notification_settings"("userId");

-- AddForeignKey
ALTER TABLE "Notification_settings" ADD CONSTRAINT "Notification_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
