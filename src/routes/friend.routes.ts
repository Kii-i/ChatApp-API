import express from "express";
import {
  acceptOrRejectReq,
  listFriends,
  listRequests,
  removeFriend,
  sendFriendReq,
} from "../controllers/friends.controller";
const router = express.Router();
router.route("/friends").get(listFriends);
router.route("/friends/requests").get(listRequests);
router.route("/friends/:friendId/requests").post(sendFriendReq);
router.route("/friends/requests/:requestId").post(acceptOrRejectReq);
router.route("/friends/:friendId/remove").post(removeFriend);
export default router;
