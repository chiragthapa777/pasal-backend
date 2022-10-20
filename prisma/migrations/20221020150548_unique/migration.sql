/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `OtherCharge` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OtherCharge_name_key" ON "OtherCharge"("name");
