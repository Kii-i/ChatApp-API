import { ServerRole } from "@prisma/client";

type RequestData = {
  userId: string;
  serverId: string;
  roleId: string;
};
export type CreateRoleType = (
  requestData: Omit<RequestData, "roleId">,
  title: string
) => Promise<ServerRole>;
export type DeleteRoleType = (requestData: RequestData) => Promise<ServerRole>;
export type GetAllRoleType = (serverId: string) => Promise<ServerRole[]>;
export type AssignRoleType = (requestData: RequestData) => Promise<string>;
