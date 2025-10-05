import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import {
  AcceptRejectType,
  ListFriendsType,
  ListRequestsType,
  RemoveFriendType,
  SendFriendReqType,
} from "../types/friends.types";
import checkDupFriendReq from "../utils/checkDupFriendReq";
import checkRequest from "../utils/checkRequest";
import checkUser from "../utils/checkUser";

export const sendFriendReqHandler: SendFriendReqType = async (requestData) => {
  const { userId, friendId } = requestData;
  if (userId === friendId)
    throw new BadRequestError("You cannot send a friend request to yourself");
  await checkUser({ id: userId });
  await checkUser({ id: friendId });
  await checkDupFriendReq(userId, friendId);

  await prisma.$transaction(async (tx) => {
    const reverseRequest = await tx.friend.findUnique({
      where: {
        userId_friendId: {
          userId: friendId,
          friendId: userId,
        },
      },
    });
    if (reverseRequest)
      throw new BadRequestError(
        "This user has already sent you a friend request. Please accept theirs instead."
      );
    await tx.friend.create({
      data: {
        userId,
        friendId,
      },
    });
  });
};
export const acceptOrRejectReqHandler: AcceptRejectType = async (
  requestData,
  action
) => {
  const { userId, requestId } = requestData;
  const request = await checkRequest(requestId);
  await checkUser({ id: userId });
  if (request.userId === userId)
    throw new BadRequestError(
      "you can't accept or reject your own sent requests"
    );
  switch (action) {
    case "accepted":
      await prisma.$transaction(async (tx) => {
        await tx.friend.update({
          where: {
            id: requestId,
          },
          data: {
            status: "ACCEPTED",
          },
        });
        await tx.friend.create({
          data: {
            userId: request.friendId,
            friendId: request.userId,
            status: "ACCEPTED",
          },
        });
      });
      return { message: "Request accepted" };

    case "rejected":
      await prisma.friend.delete({
        where: {
          id: requestId,
        },
      });
      return { message: "Request rejected" };
  }
};
export const listFriendsHandler: ListFriendsType = async (userId) => {
  await checkUser({ id: userId });
  return await prisma.friend.findMany({
    where: {
      userId,
      status: "ACCEPTED",
    },
    select: {
      friend: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
};
export const listRequestsHandler: ListRequestsType = async (userId) => {
  await checkUser({ id: userId });
  const sentRequest = await prisma.friend.findMany({
    where: {
      userId,
      status: "PENDING",
    },
    select: {
      id: true,
      friend: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
  const pendingRequest = await prisma.friend.findMany({
    where: {
      friendId: userId,
      status: "PENDING",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return { sentRequest, pendingRequest };
};
export const removeFriendHandler: RemoveFriendType = async (requestData) => {
  const { userId, friendId } = requestData;
  await checkUser({ id: userId });
  await checkUser({ id: friendId });
  await prisma.friend.deleteMany({
    where: {
      OR: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
      status: "ACCEPTED",
    },
  });
};
