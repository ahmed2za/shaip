/*
  Warnings:

  - You are about to drop the column `isApproved` on the `BlogComment` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `metaDesc` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `reviewId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `featured` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `premiumFeatures` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `responseRate` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `socialMedia` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `workingHours` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `viewedAt` on the `CompanyView` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `metaDesc` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `advice` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `companyResponse` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `cons` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `helpfulCount` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `pros` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `responseDate` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Advertisement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DraftComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogPostToCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BlogPostToTag` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'COMPANY');

-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyView" DROP CONSTRAINT "CompanyView_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyView" DROP CONSTRAINT "CompanyView_userId_fkey";

-- DropForeignKey
ALTER TABLE "DraftComment" DROP CONSTRAINT "DraftComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToCategory" DROP CONSTRAINT "_BlogPostToCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToCategory" DROP CONSTRAINT "_BlogPostToCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToTag" DROP CONSTRAINT "_BlogPostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToTag" DROP CONSTRAINT "_BlogPostToTag_B_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- DropIndex
DROP INDEX "Comment_reviewId_idx";

-- DropIndex
DROP INDEX "CompanyView_userId_companyId_key";

-- DropIndex
DROP INDEX "CompanyView_viewedAt_idx";

-- DropIndex
DROP INDEX "Media_createdBy_idx";

-- DropIndex
DROP INDEX "Notification_createdAt_idx";

-- AlterTable
ALTER TABLE "BlogComment" DROP COLUMN "isApproved";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "coverImage",
DROP COLUMN "excerpt",
DROP COLUMN "isPublished",
DROP COLUMN "metaDesc",
DROP COLUMN "metaTitle",
DROP COLUMN "publishedAt",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "companyId" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "reviewId";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "category",
DROP COLUMN "featured",
DROP COLUMN "industry",
DROP COLUMN "location",
DROP COLUMN "premiumFeatures",
DROP COLUMN "rating",
DROP COLUMN "responseRate",
DROP COLUMN "services",
DROP COLUMN "socialMedia",
DROP COLUMN "verified",
DROP COLUMN "workingHours",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "coverImage" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CompanyView" DROP COLUMN "viewedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "createdBy",
DROP COLUMN "mimeType",
DROP COLUMN "name",
DROP COLUMN "size",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
DROP COLUMN "title",
ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "isPublished",
DROP COLUMN "metaDesc",
DROP COLUMN "metaTitle",
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "advice",
DROP COLUMN "companyResponse",
DROP COLUMN "cons",
DROP COLUMN "content",
DROP COLUMN "helpfulCount",
DROP COLUMN "pros",
DROP COLUMN "responseDate",
DROP COLUMN "title",
ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hashedPassword" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Advertisement";

-- DropTable
DROP TABLE "DraftComment";

-- DropTable
DROP TABLE "Settings";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_BlogPostToCategory";

-- DropTable
DROP TABLE "_BlogPostToTag";

-- DropEnum
DROP TYPE "CompanySize";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "_UserCompanies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserCompanies_AB_unique" ON "_UserCompanies"("A", "B");

-- CreateIndex
CREATE INDEX "_UserCompanies_B_index" ON "_UserCompanies"("B");

-- CreateIndex
CREATE INDEX "BlogPost_companyId_idx" ON "BlogPost"("companyId");

-- CreateIndex
CREATE INDEX "BlogPost_categoryId_idx" ON "BlogPost"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_userId_key" ON "Company"("userId");

-- CreateIndex
CREATE INDEX "Company_categoryId_idx" ON "Company"("categoryId");

-- CreateIndex
CREATE INDEX "Media_userId_idx" ON "Media"("userId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyView" ADD CONSTRAINT "CompanyView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyView" ADD CONSTRAINT "CompanyView_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompanies" ADD CONSTRAINT "_UserCompanies_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserCompanies" ADD CONSTRAINT "_UserCompanies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
