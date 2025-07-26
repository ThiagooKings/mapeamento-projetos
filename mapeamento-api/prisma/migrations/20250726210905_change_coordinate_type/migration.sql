/*
  Warnings:

  - You are about to drop the column `coordinates` on the `Geometry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Geometry" DROP COLUMN "coordinates",
ADD COLUMN     "coordinateType" JSONB;
