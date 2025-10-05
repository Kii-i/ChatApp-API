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
router.route("/friend/requests").get(listRequests);
router.route("/friend/:friendId/request").post(sendFriendReq);
router.route("/friend/request/:requestId").post(acceptOrRejectReq);
router.route("/friend/:friendId/remove").post(removeFriend);
export default router;
