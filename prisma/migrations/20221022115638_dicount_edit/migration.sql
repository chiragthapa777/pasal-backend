/*
  Warnings:

  - You are about to drop the column `validityFrom` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `validityTo` on the `Discount` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "validityFrom",
DROP COLUMN "validityTo";
