/*
  Warnings:

  - Added the required column `quantity` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL;
