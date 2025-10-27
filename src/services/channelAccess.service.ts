import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import {
  GetChannelRolePermissionsType,
  RemoveChannelRolePermissionType,
  SetChannelRolePermissionType,
} from "../types/channelAccess.types";
import catchError from "../utils/catchError";
import checkChannel from "../utils/checkChannel";
import checkRole from "../utils/checkRole";
import checkRoleArray from "../utils/checkRoleArray";
import checkServer from "../utils/checkServer";

export const setChannelRolePermissionHandler: SetChannelRolePermissionType =
  async (requestData, roleIds) => {
    const { channelId, serverId } = requestData;
    await checkServer(serverId);
    await checkChannel(channelId, serverId);
    const validRoles = await checkRoleArray(roleIds, serverId);
    const result = await prisma.$transaction(async (tx) => {
      let channelAccessRole = await tx.channelAccessRole.findFirst({
        where: {
          channelId,
        },
      });
      if (!channelAccessRole) {
        channelAccessRole = await tx.channelAccessRole.create({
          data: {
            channelId,
          },
        });
      }
      const updatedServerRole = await Promise.all(
        validRoles.map((roles) =>
          tx.serverRole.update({
            where: {
              id: roles.id,
            },
            data: {
              channelAccessRoleId: channelAccessRole.id,
            },
          })
        )
      );
      return updatedServerRole;
    });
    return result;
  };

export const removeChannelRolePermissionHandler: RemoveChannelRolePermissionType =
  async (requestData, roleIds) => {
    const { channelId, serverId } = requestData;
    await checkServer(serverId);
    await checkChannel(channelId, serverId);
    const validRoles = await checkRoleArray(roleIds, serverId);
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        validRoles.map((role) =>
          tx.serverRole.update({
            where: {
              id: role.id,
            },
            data: {
              channelAccessRoleId: null,
            },
          })
        )
      );
    });
  };

export const getChannelRolePermissionsHandler: GetChannelRolePermissionsType =
  async (requestData) => {
    const { serverId, channelId } = requestData;
    await checkServer(serverId);
    await checkChannel(channelId, serverId);
    const channelRoles = await prisma.channelAccessRole.findMany({
      where: {
        channelId,
      },
      include: {
        requiredRole: true,
      },
    });
    if (!channelRoles) {
      return [];
    }
    return channelRoles;
  };
