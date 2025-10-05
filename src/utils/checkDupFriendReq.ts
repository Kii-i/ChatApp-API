import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

const checkDupFriendReq = async (userId: string, friendId: string) => {
  const existingRequest = await prisma.friend.findUnique({
    where: {
      userId_friendId: {
        userId,
        friendId,
      },
    },
  });
  if (existingRequest?.status === "PENDING")
    throw new BadRequestError("Friend request already exists");
  if (existingRequest?.status === "ACCEPTED")
    throw new BadRequestError(
      "You can't send friend request to the user who is already in your friends list"
    );
};

export default checkDupFriendReq;
