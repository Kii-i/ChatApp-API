import { Server } from "@prisma/client";
import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

const checkServer = async (serverId: string): Promise<Server> => {
  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
      deletedAt: null,
    },
  });
  if (!server) throw new BadRequestError(`Invalid serverId: ${serverId}`);
  return server;
};
export default checkServer;
