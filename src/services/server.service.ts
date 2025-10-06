import { Prisma } from "@prisma/client";
import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import {
  CreateServerType,
  DeleteServerType,
  GetServerType,
  JoinServerType,
  LeaveServerType,
  ListServerOwnedType,
  UpdateServerType,
} from "../types/server.types";
import checkUser from "../utils/checkUser";
import checkServerWithUser from "../utils/checkServerWithUser";
import checkServer from "../utils/checkServer";
import checkUserInServer from "../utils/checkUserInServer";

// create server
export const createServerHandler: CreateServerType = async (userId, data) => {
  await checkUser({ id: userId });
  const { title, avatarUrl } = data;
  return await prisma.$transaction(async (tx) => {
    const server = await tx.server.create({
      data: {
        title,
        avatarUrl:
          avatarUrl ??
          `https://avatar.iran.liara.run/username?username=${title}`,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    const serverRole = await tx.serverRole.create({
      data: {
        serverId: server.id,
        title: "OWNER",
      },
    });
    await tx.userOnServer.create({
      data: {
        userId,
        serverId: server.id,
      },
    });
    await tx.userRolesOnServer.create({
      data: {
        userId,
        serverId: server.id,
        roleId: serverRole.id,
      },
    });
    return server;
  });
};

// update server
export const updateServerHandler: UpdateServerType = async (
  requestData,
  data
) => {
  const { userId, serverId } = requestData;
  await checkUser({ id: userId });
  await checkServerWithUser(serverId, userId);
  const server = await prisma.server.update({
    where: {
      id: serverId,
    },
    data,
  });
  return server;
};

// get full server details, everything
export const getServerDetailsHandler: GetServerType = async (
  requestData,
  include
) => {
  const { userId, serverId } = requestData;
  await checkUser({ id: userId });
  return await checkServerWithUser(serverId, userId, include);
};

export const membersOnServerHandler = async (serverId: string) => {
  await checkServer(serverId);
  return prisma.userOnServer.findMany({
    where: {
      serverId,
    },
  });
};
export const listServerOwnedHandler: ListServerOwnedType = async (userId) => {
  await checkUser({ id: userId });
  return await prisma.server.findMany({
    where: {
      ownerId: userId,
      deletedAt: null,
    },
  });
};
export const listServerJoinedHandler = async (userId: string) => {
  await checkUser({ id: userId });
  return await prisma.userOnServer.findMany({
    where: {
      userId,
    },
    include: {
      server: true,
    },
  });
};
export const joinServerHandler: JoinServerType = async (requestData) => {
  const { serverId, userId } = requestData;
  await checkUser({ id: userId });
  await checkServer(serverId);
  const alreadyJoin = await checkUserInServer(serverId, userId);
  if (alreadyJoin)
    throw new BadRequestError("User has already joined the server");
  await prisma.userOnServer.create({
    data: {
      userId,
      serverId,
    },
  });
};
export const leaveServerHandler: LeaveServerType = async (
  requestData,
  newOwnerId
) => {
  const { serverId, userId } = requestData;
  await checkUser({ id: userId });
  const server = await checkServer(serverId);
  const userInServer = await checkUserInServer(serverId, userId);
  if (!userInServer)
    throw new BadRequestError("User has already left the server");
  if (userId !== server.ownerId) {
    await prisma.userOnServer.delete({
      where: {
        userId_serverId: {
          userId,
          serverId,
        },
      },
    });
    return;
  }

  const totalMembers = await prisma.userOnServer.count({
    where: {
      serverId,
      NOT: {
        userId,
      },
    },
  });
  await prisma.$transaction(async (tx) => {
    await tx.userOnServer.delete({
      where: {
        userId_serverId: {
          userId,
          serverId,
        },
      },
    });
    if (totalMembers > 0) {
      if (!newOwnerId)
        throw new BadRequestError(
          "newOwnerId is required for owner to leave the server"
        );
      await tx.server.update({
        where: {
          id: serverId,
        },
        data: {
          ownerId: newOwnerId,
        },
      });
    } else {
      await tx.server.update({
        where: {
          id: serverId,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }
  });
};
export const deleteServerHandler: DeleteServerType = async (requestData) => {
  const { serverId, userId } = requestData;
  await checkUser({ id: userId });
  await checkServerWithUser(serverId, userId);
  await prisma.server.update({
    where: {
      id: serverId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
