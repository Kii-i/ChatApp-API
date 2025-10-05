import { Prisma, Server } from "@prisma/client";
import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import NotFoundError from "../errors/NotFound.error";

const checkServerWithUser = async <T extends Prisma.ServerInclude | undefined>(
  serverId: string,
  userId: string,
  include?: T
): Promise<
  T extends Prisma.ServerInclude
    ? Prisma.ServerGetPayload<{ include: T }>
    : Server
> => {
  if (!serverId || !userId)
    throw new BadRequestError("Please provide serverId");
  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
      ownerId: userId,
      deletedAt: null,
    },
    include: include ?? undefined,
  });

  if (!server)
    throw new NotFoundError(`No server found with the serverId: ${serverId}`);
  return server as T extends Prisma.ServerInclude
    ? Prisma.ServerGetPayload<{ include: T }>
    : Server;
};
export default checkServerWithUser;
