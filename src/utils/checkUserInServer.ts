import { prisma } from "..";

const checkUserInServer = async (
  serverId: string,
  userId: string
): Promise<boolean> => {
  const user = await prisma.server.findFirst({
    where: {
      id: serverId,
      deletedAt: null,
      members: {
        some: {
          userId,
        },
      },
    },
  });
  return !!user;
};
export default checkUserInServer;
