import { StatusCodes } from "http-status-codes";
import {
  assignRoleHandler,
  createRoleHandler,
  deleteRoleHandler,
  getAllRoleHandler,
} from "../services/serverRole.service";
import catchError from "../utils/catchError";
import { CreateRoleSchema } from "../zodSchema/serverRole.schema";

export const createRole = catchError(async (req, res) => {
  const requestData = {
    userId: req.params.userId,
    serverId: req.params.serverId,
  };
  const parsedData = CreateRoleSchema.parse({ ...req.body });
  const role = await createRoleHandler(requestData, parsedData.title);
  res.status(StatusCodes.CREATED).json({ role });
});
export const deleteRole = catchError(async (req, res) => {
  const requestData = {
    userId: req.params.userId,
    serverId: req.params.serverId,
    roleId: req.params.roleId,
  };
  const role = await deleteRoleHandler(requestData);
  res.status(StatusCodes.OK).json({ deletedRole: role });
});
export const getAllRole = catchError(async (req, res) => {
  const serverId = req.params.serverId;
  const roles = await getAllRoleHandler(serverId);
  res.status(StatusCodes.OK).json({ roles });
});
export const assignRole = catchError(async (req, res) => {
  const requestData = {
    userId: req.params.userId,
    serverId: req.params.serverId,
    roleId: req.params.roleId,
  };
  const status = await assignRoleHandler(requestData);
  res.status(StatusCodes.OK).json({ status });
});
