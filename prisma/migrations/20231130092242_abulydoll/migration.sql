/*
  Warnings:

  - The `forgotPasswordToken` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "forgotPasswordToken",
ADD COLUMN     "forgotPasswordToken" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_forgotPasswordToken_key" ON "User"("forgotPasswordToken");
