import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import checkRole from "./checkRole";

const checkRoleArray = async (roleIds: string[], serverId: string) => {
  await Promise.all(roleIds.map((id) => checkRole({ id }, serverId)));
  const result = await prisma.$transaction(async (tx) => {
    const serverRoles = await tx.serverRole.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });
    const foundIds = serverRoles.map((role) => role.id);
    const missingId = roleIds.filter((id) => !foundIds.includes(id));
    if (missingId.length > 0)
      throw new BadRequestError(
        `Role with the ID: ${missingId.map((mId) => mId)} Do not exist. `
      );
    return serverRoles;
  });
  return result;
};

export default checkRoleArray;
