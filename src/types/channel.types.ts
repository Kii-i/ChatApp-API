import { Channel } from "@prisma/client";
import { MoveChannelSchema } from "../zodSchema/channel.schema";
import z from "zod";
type RequestData = {
  serverId: string;
  categoryId: string;
  channelId: string;
  userId: string;
};
export type CreateChannelType = (
  requestData: Omit<RequestData, "channelId">,
  title: string
) => Promise<Channel>;
export type UpdateChannelType = (
  requestData: Omit<RequestData, "categoryId">,
  title: string
) => Promise<Channel>;
export type DeleteChannelType = (
  requestData: Omit<RequestData, "categoryId">
) => Promise<void>;
export type GetAllChannelType = (
  requestData: Pick<RequestData, "serverId">
) => Promise<Channel[]>;
type UpdateChannelOrder = z.infer<typeof MoveChannelSchema>;
export type MoveChannelType = (
  requestData: Omit<RequestData, "categoryId">,
  data: UpdateChannelOrder
) => Promise<Channel>;
