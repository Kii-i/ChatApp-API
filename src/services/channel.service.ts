import { prisma } from "..";
import {
  CreateChannelType,
  DeleteChannelType,
  GetAllChannelType,
  MoveChannelType,
  UpdateChannelType,
} from "../types/channel.types";
import checkCategory from "../utils/checkCategory";
import checkChannel from "../utils/checkChannel";
import checkServer from "../utils/checkServer";

export const createChannelHandler: CreateChannelType = async (
  requestData,
  title
) => {
  const { categoryId, serverId } = requestData;
  await checkServer(serverId);
  await checkCategory(categoryId, serverId);
  const lastChannel = await prisma.channel.findFirst({
    where: {
      serverId,
      categoryId,
    },
    orderBy: {
      order: "desc",
    },
  });
  const newChannelOrder = lastChannel ? lastChannel.order + 1 : 1;
  return await prisma.channel.create({
    data: {
      serverId,
      title,
      categoryId,
      order: newChannelOrder,
    },
  });
};
export const deleteChannelHandler: DeleteChannelType = async (requestData) => {
  const { channelId, serverId } = requestData;
  await checkServer(serverId);
  await checkChannel(channelId, serverId);
  await prisma.channel.delete({
    where: {
      id: channelId,
    },
  });
};
export const updateChannelHandler: UpdateChannelType = async (
  requestData,
  title
) => {
  const { channelId, serverId } = requestData;
  await checkServer(serverId);
  await checkChannel(channelId, serverId);
  return await prisma.channel.update({
    where: {
      id: channelId,
    },
    data: {
      title,
    },
  });
};
export const getAllChannelsHandler: GetAllChannelType = async (requestData) => {
  const { serverId } = requestData;
  await checkServer(serverId);
  return prisma.channel.findMany({
    where: {
      serverId,
    },
  });
};

export const moveChannelHandler: MoveChannelType = async (
  requestData,
  data
) => {
  const { channelId, serverId } = requestData;
  const { targetCategoryId, targetOrder } = data;
  const channel = await checkChannel(channelId, serverId);
  await checkServer(serverId);
  await checkCategory(targetCategoryId, serverId);
  if (channel.categoryId === targetCategoryId && targetOrder === undefined) {
    return channel;
  }
  return prisma.$transaction(async (tx) => {
    await tx.channel.updateMany({
      where: {
        categoryId: channel.categoryId,
        order: {
          gt: channel.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
    let newOrder;
    if (targetOrder !== undefined) {
      await tx.channel.updateMany({
        where: {
          categoryId: targetCategoryId,
          order: {
            gte: targetOrder,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
      newOrder = targetOrder;
    } else {
      const lastChannel = await tx.channel.findFirst({
        where: {
          categoryId: targetCategoryId,
        },
        orderBy: {
          order: "desc",
        },
      });
      newOrder = lastChannel ? lastChannel.order + 1 : 1;
    }
    return tx.channel.update({
      where: {
        id: channelId,
      },
      data: {
        categoryId: targetCategoryId,
        order: newOrder,
      },
    });
  });
};
