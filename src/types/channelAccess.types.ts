import { ChannelAccessRole, ServerRole } from "@prisma/client";
type RequestData = {
  serverId: string;
  channelId: string;
  channelAccessRoleId: string;
};
export type SetChannelRolePermissionType = (
  requestData: Omit<RequestData, "channelAccessRoleId">,
  roleIds: string[]
) => Promise<ServerRole[]>;
export type RemoveChannelRolePermissionType = (
  requestData: Omit<RequestData, "channelAccessRoleId">,
  roleIds: string[]
) => Promise<void>;
export type GetChannelRolePermissionsType = (
  requestData: RequestData
) => Promise<ChannelAccessRole[]>;
