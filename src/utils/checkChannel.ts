import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

const checkChannel = async (channelId: string, serverId: string) => {
  const channel = await prisma.channel.findFirst({
    where: {
      id: channelId,
      serverId,
    },
  });
  if (!channel)
    throw new BadRequestError(
      `Channel with the id: ${channelId} does not exists!`
    );
  return channel;
};

export default checkChannel;
