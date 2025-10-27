import { StatusCodes } from "http-status-codes";
import {
  getChannelRolePermissionsHandler,
  removeChannelRolePermissionHandler,
  setChannelRolePermissionHandler,
} from "../services/channelAccess.service";
import catchError from "../utils/catchError";
import {
  RemoveChannelRolePermissionSchema,
  SetChannelRolePermissionSchema,
} from "../zodSchema/channelAccess.schema";

export const setChannelRolePermission = catchError(async (req, res) => {
  const requestData = {
    channelId: req.params.channelId,
    serverId: req.params.serverId,
  };
  const parsedData = SetChannelRolePermissionSchema.parse({ ...req.body });
  const role = await setChannelRolePermissionHandler(
    requestData,
    parsedData.roleIds
  );
  res.status(StatusCodes.OK).json({ role });
});
export const deleteChannelRolePermission = catchError(async (req, res) => {
  const requestData = {
    channelId: req.params.channelId,
    serverId: req.params.serverId,
  };
  const parsedData = RemoveChannelRolePermissionSchema.parse({ ...req.body });
  await removeChannelRolePermissionHandler(requestData, parsedData.roleIds);
  res.status(StatusCodes.OK).json({ message: "Role removed" });
});
export const getChannelRolePermissions = catchError(async (req, res) => {
  const requestData = {
    channelId: req.params.channelId,
    serverId: req.params.serverId,
  };
  const roles = await getChannelRolePermissionsHandler(requestData);
  res.status(StatusCodes.OK).json({ roles });
});
