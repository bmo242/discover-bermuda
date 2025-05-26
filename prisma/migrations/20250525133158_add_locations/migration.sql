/*
  Warnings:

  - The values [MURAL,FOOD,RESTROOM] on the enum `LocationCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `imageUrl` on the `Location` table. All the data in the column will be lost.
  - Added the required column `address` to the `Location` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Location` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "LocationCategory_new" AS ENUM ('BEACH', 'RESTAURANT', 'HOTEL', 'ATTRACTION', 'SHOPPING', 'NIGHTLIFE', 'PARK', 'HISTORIC_SITE', 'SPORTS', 'OTHER');
ALTER TABLE "Location" ALTER COLUMN "category" TYPE "LocationCategory_new" USING ("category"::text::"LocationCategory_new");
ALTER TYPE "LocationCategory" RENAME TO "LocationCategory_old";
ALTER TYPE "LocationCategory_new" RENAME TO "LocationCategory";
DROP TYPE "LocationCategory_old";
COMMIT;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "imageUrl",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "category" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
