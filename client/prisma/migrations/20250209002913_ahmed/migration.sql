/*
  Warnings:

  - You are about to drop the column `icon` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `businessHours` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `founded` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `reviewCount` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Company` table. All the data in the column will be lost.
  - The `location` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CompanyFavorite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `helpful` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `reported` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `sentiment` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Advertisement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CategoryToCompany` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,companyId]` on the table `CompanyFavorite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `CompanyFavorite` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `content` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_userId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_companyId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCompany" DROP CONSTRAINT "_CategoryToCompany_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToCompany" DROP CONSTRAINT "_CategoryToCompany_B_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_provider_providerId_idx";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "icon",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "businessHours",
DROP COLUMN "founded",
DROP COLUMN "phone",
DROP COLUMN "reviewCount",
DROP COLUMN "size",
DROP COLUMN "verified",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "workingHours" JSONB,
ALTER COLUMN "description" SET NOT NULL,
DROP COLUMN "location",
ADD COLUMN     "location" JSONB,
ALTER COLUMN "socialMedia" SET DEFAULT '{"facebook": null, "twitter": null, "linkedin": null, "instagram": null}',
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CompanyFavorite" DROP CONSTRAINT "CompanyFavorite_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CompanyFavorite_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "message",
ADD COLUMN     "content" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "helpful",
DROP COLUMN "reported",
DROP COLUMN "sentiment";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "provider",
DROP COLUMN "providerId",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorSecret",
DROP COLUMN "updatedAt",
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Advertisement";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "_CategoryToCompany";

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BlogComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogPostToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlogPostToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_createdBy_idx" ON "Page"("createdBy");

-- CreateIndex
CREATE INDEX "Page_updatedBy_idx" ON "Page"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_createdBy_idx" ON "BlogPost"("createdBy");

-- CreateIndex
CREATE INDEX "BlogPost_updatedBy_idx" ON "BlogPost"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "BlogComment_postId_idx" ON "BlogComment"("postId");

-- CreateIndex
CREATE INDEX "BlogComment_userId_idx" ON "BlogComment"("userId");

-- CreateIndex
CREATE INDEX "Media_createdBy_idx" ON "Media"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToCategory_AB_unique" ON "_BlogPostToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToCategory_B_index" ON "_BlogPostToCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToTag_AB_unique" ON "_BlogPostToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToTag_B_index" ON "_BlogPostToTag"("B");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_reviewId_idx" ON "Comment"("reviewId");

-- CreateIndex
CREATE INDEX "Comment_companyId_idx" ON "Comment"("companyId");

-- CreateIndex
CREATE INDEX "CompanyFavorite_userId_idx" ON "CompanyFavorite"("userId");

-- CreateIndex
CREATE INDEX "CompanyFavorite_companyId_idx" ON "CompanyFavorite"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyFavorite_userId_companyId_key" ON "CompanyFavorite"("userId", "companyId");

-- CreateIndex
CREATE INDEX "DraftComment_userId_idx" ON "DraftComment"("userId");

-- CreateIndex
CREATE INDEX "DraftComment_sessionId_idx" ON "DraftComment"("sessionId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_companyId_idx" ON "Review"("companyId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogComment" ADD CONSTRAINT "BlogComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToCategory" ADD CONSTRAINT "_BlogPostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToCategory" ADD CONSTRAINT "_BlogPostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostToTag" ADD CONSTRAINT "_BlogPostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
