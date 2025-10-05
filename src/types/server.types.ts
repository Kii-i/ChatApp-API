import { Prisma, Server } from "@prisma/client";
import z from "zod";
import {
  CreateServerSchema,
  leaveServerSchema,
  UpdateServerSchema,
} from "../zodSchema/server.schema";

type requestData = {
  serverId: string;
  userId: string;
};
type CreateServerData = z.infer<typeof CreateServerSchema>;
export type createServerType = (
  userId: string,
  data: CreateServerData
) => Promise<Server>;

type UpdateServerData = z.infer<typeof UpdateServerSchema>;
export type updateServerType = (
  requestData: requestData,
  data: UpdateServerData
) => Promise<Server>;

export type GetServerType = <T extends Prisma.ServerInclude | undefined>(
  requestData: requestData,
  include?: T
) => Promise<
  T extends Prisma.ServerInclude
    ? Prisma.ServerGetPayload<{ include: T }>
    : Server
>;
export type listServerOwnedType = (userId: string) => Promise<Server[]>;

export type joinServerType = (requestData: requestData) => Promise<void>;
export type leaveServerType = (
  requestData: requestData,
  newOwnerId?: string
) => Promise<void>;
export type deleteServerType = (requestData: requestData) => Promise<void>;
