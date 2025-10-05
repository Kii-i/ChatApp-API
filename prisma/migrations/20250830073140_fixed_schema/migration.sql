/*
  Warnings:

  - You are about to drop the column `user_id` on the `servers` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `servers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "servers" DROP CONSTRAINT "servers_user_id_fkey";

-- AlterTable
ALTER TABLE "servers" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
