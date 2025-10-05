import { StatusCodes } from "http-status-codes";
import {
  acceptOrRejectReqHandler,
  listFriendsHandler,
  listRequestsHandler,
  removeFriendHandler,
  sendFriendReqHandler,
} from "../services/friends.service";
import { AcceptRejectSchema } from "../zodSchema/friend.schema";
import catchError from "../utils/catchError";

export const sendFriendReq = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    friendId: req.params.friendId,
  };
  await sendFriendReqHandler(requestData);
  res.status(StatusCodes.OK).json({ message: "request has been sent" });
});
export const acceptOrRejectReq = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    requestId: req.params.requestId,
  };
  const parsedData = AcceptRejectSchema.parse(req.body.status);
  const { message } = await acceptOrRejectReqHandler(requestData, parsedData);
  res.status(StatusCodes.OK).json({ message });
});
export const listFriends = catchError(async (req, res) => {
  const userId = req.user.id;
  const friends = await listFriendsHandler(userId);
  res.status(StatusCodes.OK).json({ friends });
});
export const listRequests = catchError(async (req, res) => {
  const userId = req.user.id;
  const { sentRequest, pendingRequest } = await listRequestsHandler(userId);
  res.status(StatusCodes.OK).json({ sentRequest, pendingRequest });
});
export const removeFriend = catchError(async (req, res) => {
  const requestData = {
    userId: req.user.id,
    friendId: req.params.friendId,
  };
  await removeFriendHandler(requestData);
  res.status(StatusCodes.OK).json({ success: "true" });
});
