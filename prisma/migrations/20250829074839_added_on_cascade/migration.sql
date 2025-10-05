-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_server_id_fkey";

-- DropForeignKey
ALTER TABLE "channel_access_role" DROP CONSTRAINT "channel_access_role_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_friend_id_fkey";

-- DropForeignKey
ALTER TABLE "friends" DROP CONSTRAINT "friends_user_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_recipient_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_userId_fkey";

-- DropForeignKey
ALTER TABLE "server_role" DROP CONSTRAINT "server_role_server_id_fkey";

-- DropForeignKey
ALTER TABLE "user_on_server" DROP CONSTRAINT "user_on_server_server_id_fkey";

-- DropForeignKey
ALTER TABLE "user_on_server" DROP CONSTRAINT "user_on_server_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles_on_server" DROP CONSTRAINT "user_roles_on_server_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_roles_on_server" DROP CONSTRAINT "user_roles_on_server_userId_server_id_fkey";

-- AddForeignKey
ALTER TABLE "user_on_server" ADD CONSTRAINT "user_on_server_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_on_server" ADD CONSTRAINT "user_on_server_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_role" ADD CONSTRAINT "server_role_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles_on_server" ADD CONSTRAINT "user_roles_on_server_userId_server_id_fkey" FOREIGN KEY ("userId", "server_id") REFERENCES "user_on_server"("user_id", "server_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles_on_server" ADD CONSTRAINT "user_roles_on_server_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "server_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_access_role" ADD CONSTRAINT "channel_access_role_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
