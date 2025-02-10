/*
  Warnings:

  - You are about to drop the column `description` on the `Category` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "description",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "premiumFeatures" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "responseRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "companyResponse" TEXT,
ADD COLUMN     "helpfulCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "responseDate" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CompanyCategory" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CompanyCategory_companyId_idx" ON "CompanyCategory"("companyId");

-- CreateIndex
CREATE INDEX "CompanyCategory_categoryId_idx" ON "CompanyCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyCategory_companyId_categoryId_key" ON "CompanyCategory"("companyId", "categoryId");

-- AddForeignKey
ALTER TABLE "CompanyCategory" ADD CONSTRAINT "CompanyCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyCategory" ADD CONSTRAINT "CompanyCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
