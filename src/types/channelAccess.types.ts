import { ChannelAccessRole } from "@prisma/client";
type RequestData = {
  serverId: string;
  channelId: string;
  roleId: string;
  allowedRoleId: string;
};
export type SetChannelRolePermissionType = (
  requestData: Omit<RequestData, "allowedRole">,
  role: string[]
) => Promise<ChannelAccessRole>;
export type DeleteChannelROlePermissionType = (
  requestData: Omit<RequestData, "roleId">
) => Promise<void>;
export type GetChannelRolePermissionsType = (
  requestData: Pick<RequestData, "serverId" | "channelId">
) => Promise<ChannelAccessRole[]>;
