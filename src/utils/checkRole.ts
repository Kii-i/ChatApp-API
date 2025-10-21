import { ServerRole } from "@prisma/client";
import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

type CheckRoleType = (
  checkField: { id?: string; title?: string },
  serverId: string,
  existence?: boolean
) => Promise<ServerRole>;

const checkRole: CheckRoleType = async (
  checkField,
  serverId,
  existence = false
) => {
  const { id, title } = checkField;
  if (!id && !title)
    throw new BadRequestError(
      "Please provide either id or title to check role"
    );
  const role = await prisma.serverRole.findFirst({
    where: {
      serverId,
      ...(id && { id }),
      ...(title && { title }),
    },
  });
  if (existence && role)
    throw new BadRequestError(
      "Role with this id or title already exists in the server"
    );
  if (!existence && !role)
    throw new BadRequestError(
      "Role with this id or title doesn't exists in the server"
    );
  return role!;
};
export default checkRole;
