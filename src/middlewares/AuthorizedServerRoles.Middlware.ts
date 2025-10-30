import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import checkServer from "../utils/checkServer";
import checkChannel from "../utils/checkChannel";
import ForbiddenError from "../errors/Forbidden.error";

type AuthorizedServerRolesType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const AuthorizedServerRoles: AuthorizedServerRolesType = async (
  req,
  res,
  next
) => {
  const { serverId, userId, channelId } = req.params;
  try {
    await checkServer(serverId);
    await checkChannel(channelId, serverId);
    const [allowedRoles, userRoles] = await prisma.$transaction([
      prisma.channelAccessRole.findMany({
        where: {
          channelId,
        },
        include: {
          requiredRole: {
            select: {
              id: true,
            },
          },
        },
      }),
      prisma.userRolesOnServer.findMany({
        where: {
          userId,
          serverId,
        },
        include: {
          serverRole: {
            select: {
              id: true,
            },
          },
        },
      }),
    ]);
    const requiredRoleIds = allowedRoles.flatMap((role) =>
      role.requiredRole.map((r) => r.id)
    );
    const isAuthorized = userRoles.some((r) =>
      requiredRoleIds.includes(r.serverRole.id)
    );
    if (!isAuthorized) {
      throw new ForbiddenError("You are not allowed to access this route");
    }
    next();
  } catch (error) {
    next(error);
  }
};
export default AuthorizedServerRoles;
