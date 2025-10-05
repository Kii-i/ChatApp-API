/*
  Warnings:

  - Added the required column `title` to the `server_role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "server_role" ADD COLUMN     "title" TEXT NOT NULL;
