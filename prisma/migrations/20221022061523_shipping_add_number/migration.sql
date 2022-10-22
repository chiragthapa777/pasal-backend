/*
  Warnings:

  - Made the column `district` on table `Shipping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ward` on table `Shipping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street` on table `Shipping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Shipping` required. This step will fail if there are existing NULL values in that column.
  - Made the column `province` on table `Shipping` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shipping" ALTER COLUMN "district" SET NOT NULL,
ALTER COLUMN "ward" SET NOT NULL,
ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "province" SET NOT NULL;
