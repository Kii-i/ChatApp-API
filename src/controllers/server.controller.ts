import { StatusCodes } from "http-status-codes";
import catchError from "../utils/catchError";
import {
  CreateServerSchema,
  LeaveServerSchema,
  UpdateServerSchema,
} from "../zodSchema/server.schema";
import {
  createServerHandler,
  deleteServerHandler,
  getServerDetailsHandler,
  joinServerHandler,
  leaveServerHandler,
  listServerJoinedHandler,
  listServerOwnedHandler,
  membersOnServerHandler,
  updateServerHandler,
} from "../services/server.service";

export const createServer = catchError(async (req, res) => {
  const userId = req.user.id;
  const parsedData = CreateServerSchema.parse({ ...req.body });
  const server = await createServerHandler(userId, parsedData);
  res.status(StatusCodes.OK).json(server);
});
export const updateServer = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    serverId: String(req.params.serverId),
  };
  const parsedData = UpdateServerSchema.parse({ ...req.body });
  const server = await updateServerHandler(requestData, parsedData);
  res.status(StatusCodes.OK).json({ server });
});
export const getServerDetails = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    serverId: String(req.params.serverId),
  };
  const server = await getServerDetailsHandler(requestData, {
    members: true,
    serverRoles: true,
    channels: true,
  });
  res.status(StatusCodes.OK).json({ server });
});
export const membersOnServer = catchError(async (req, res) => {
  const serverId = String(req.params.serverId);
  const members = await membersOnServerHandler(serverId);
  res.status(StatusCodes.OK).json({ members, count: members.length });
});
export const listServerOwned = catchError(async (req, res) => {
  const userId = req.user.id;
  const server = await listServerOwnedHandler(userId);
  res.status(StatusCodes.OK).json({ server, count: server.length });
});
export const listServerJoined = catchError(async (req, res) => {
  const userId = req.user.id;
  const server = await listServerJoinedHandler(userId);
  res.status(StatusCodes.OK).json({ server, count: server.length });
});

export const joinServer = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    serverId: String(req.params.serverId),
  };
  await joinServerHandler(requestData);
  res.status(StatusCodes.OK).json({ success: true });
});
export const leaveServer = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    serverId: String(req.params.serverId),
  };
  const { newOwnerId } = LeaveServerSchema.parse({ ...req.body });
  await leaveServerHandler(requestData, newOwnerId);
  res.status(StatusCodes.OK).json({ success: true });
});
export const deleteServer = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    serverId: String(req.params.serverId),
  };
  await deleteServerHandler(requestData);
  res.status(StatusCodes.OK).json({ success: true });
});
