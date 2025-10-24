import { StatusCodes } from "http-status-codes";
import {
  createChannelHandler,
  deleteChannelHandler,
  getAllChannelsHandler,
  moveChannelHandler,
  updateChannelHandler,
} from "../services/channel.service";
import catchError from "../utils/catchError";
import {
  createChannelSchema,
  MoveChannelSchema,
  UpdateChannelSchema,
} from "../zodSchema/channel.schema";

export const createChannel = catchError(async (req, res) => {
  const requestData = {
    categoryId: req.params.categoryId,
    serverId: req.params.serverId,
  };
  const parsedData = createChannelSchema.parse({ ...req.body });
  const channel = await createChannelHandler(requestData, parsedData.title);
  res.status(StatusCodes.CREATED).json(channel);
});
export const deleteChannel = catchError(async (req, res) => {
  const requestData = {
    channelId: req.params.channelId,
    serverId: req.params.serverId,
  };
  await deleteChannelHandler(requestData);
  res.status(StatusCodes.OK).json("channel deleted");
});
export const updateChannel = catchError(async (req, res) => {
  const requestData = {
    channelId: req.params.channelId,
    serverId: req.params.serverId,
  };
  const parsedData = UpdateChannelSchema.parse({ ...req.body });
  const channel = await updateChannelHandler(requestData, parsedData.title);
  res.status(StatusCodes.CREATED).json({ updatedChannel: channel });
});
export const getAllChannels = catchError(async (req, res) => {
  const requestData = {
    serverId: req.params.serverId,
  };
  const channels = await getAllChannelsHandler(requestData);
  res.status(StatusCodes.CREATED).json({ channels });
});
export const moveChannel = catchError(async (req, res) => {
  const requestData = {
    channelId: req.params.channelId,
    serverId: req.params.serverId,
  };
  const parsedData = MoveChannelSchema.parse({ ...req.body });
  const channel = await moveChannelHandler(requestData, parsedData);
  res.status(StatusCodes.CREATED).json({ channel });
});
