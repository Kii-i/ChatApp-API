import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import {
  AssignRoleType,
  CreateRoleType,
  DeleteRoleType,
  GetAllRoleType,
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
