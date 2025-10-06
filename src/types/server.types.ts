import { Prisma, Server } from "@prisma/client";
import z from "zod";
import {
  CreateServerSchema,
  UpdateServerSchema,
} from "../zodSchema/server.schema";

type RequestData = {
  serverId: string;
  userId: string;
};
type CreateServerData = z.infer<typeof CreateServerSchema>;
export type CreateServerType = (
  userId: string,
  data: CreateServerData
) => Promise<Server>;

type UpdateServerData = z.infer<typeof UpdateServerSchema>;
export type UpdateServerType = (
  requestData: RequestData,
  data: UpdateServerData
) => Promise<Server>;

export type GetServerType = <T extends Prisma.ServerInclude | undefined>(
  requestData: RequestData,
  include?: T
) => Promise<
  T extends Prisma.ServerInclude
    ? Prisma.ServerGetPayload<{ include: T }>
    : Server
>;
export type ListServerOwnedType = (userId: string) => Promise<Server[]>;
export type JoinServerType = (requestData: RequestData) => Promise<void>;

export type LeaveServerType = (
  requestData: RequestData,
  newOwnerId?: string
) => Promise<void>;
export type DeleteServerType = (requestData: RequestData) => Promise<void>;
