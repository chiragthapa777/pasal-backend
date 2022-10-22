/*
  Warnings:

  - You are about to drop the column `state` on the `Shipping` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shipping" DROP COLUMN "state",
ADD COLUMN     "province" TEXT;
