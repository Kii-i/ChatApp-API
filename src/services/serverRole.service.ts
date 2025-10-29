import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import {
  AssignRoleType,
  CreateRoleType,
  DeleteRoleType,
  GetAllRoleType,
  GetUserRoleType,
} from "../types/serverRole.types";
import checkOwner from "../utils/checkOwner";
import checkRole from "../utils/checkRole";
import checkServer from "../utils/checkServer";
import checkUser from "../utils/checkUser";

export const createRoleHandler: CreateRoleType = async (requestData, title) => {
  const { serverId, userId } = requestData;
  await checkServer(serverId);
  await checkOwner(userId, serverId);
  await checkRole({ title }, serverId, true);
  return await prisma.serverRole.create({
    data: {
      serverId,
      title,
    },
  });
};
export const deleteRoleHandler: DeleteRoleType = async (requestData) => {
  const { roleId, serverId, userId } = requestData;
  await checkServer(serverId);
  await checkOwner(userId, serverId);
  await checkRole({ id: roleId }, serverId);
  return await prisma.serverRole.delete({
    where: {
      id: roleId,
    },
  });
};
export const getAllRoleHandler: GetAllRoleType = async (serverId) => {
  await checkServer(serverId);
  return await prisma.serverRole.findMany({
    where: {
      serverId,
      title: {
        not: "OWNER",
      },
    },
  });
};
export const assignRoleHandler: AssignRoleType = async (requestData) => {
  const { roleId, serverId, userId } = requestData;
  await checkServer(serverId);
  await checkUser({ id: userId });
  const userOnServer = await prisma.userOnServer.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId,
      },
    },
  });
  if (!userOnServer)
    throw new BadRequestError(
      `User doesn't exist on the server with the Id:${serverId}`
    );
  const roleExist = await prisma.userRolesOnServer.findUnique({
    where: {
      userId_serverId_roleId: {
        userId,
        serverId,
        roleId,
      },
    },
  });
  if (roleExist) {
    await prisma.userRolesOnServer.delete({
      where: {
        userId_serverId_roleId: {
          userId,
          serverId,
          roleId,
        },
      },
    });
    return "Role is removed";
  } else {
    await prisma.userRolesOnServer.create({
      data: {
        userId,
        serverId,
        roleId,
      },
    });
    return "Role assigned";
  }
};
export const getUserRolesHandler: GetUserRoleType = async (requestData) => {
  const { serverId, userId } = requestData;
  await checkUser({ id: userId });
  await checkServer(serverId);
  const userRolesOnServer = await prisma.userRolesOnServer.findMany({
    where: {
      userId,
      serverId,
    },
    include: {
      serverRole: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
  return userRolesOnServer.map((userRole) => userRole.serverRole);
};
