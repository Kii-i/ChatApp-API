import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

const checkOwner = async (userId: string, serverId: string): Promise<void> => {
  const ownedServer = await prisma.server.findFirst({
    where: {
      id: serverId,
      ownerId: userId,
    },
  });

  if (!ownedServer)
    throw new BadRequestError("You are not allowed to access this route");
};

export default checkOwner;
