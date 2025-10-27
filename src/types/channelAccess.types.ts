import { ChannelAccessRole, ServerRole } from "@prisma/client";
type RequestData = {
  serverId: string;
  channelId: string;
};
export type SetChannelRolePermissionType = (
  requestData: RequestData,
  roleIds: string[]
) => Promise<ServerRole[]>;
export type RemoveChannelRolePermissionType = (
  requestData: RequestData,
  roleIds: string[]
) => Promise<void>;
export type GetChannelRolePermissionsType = (
  requestData: RequestData
) => Promise<ChannelAccessRole[]>;
