import express from "express";
import {
  acceptOrRejectReq,
  listFriends,
  listRequests,
  removeFriend,
  sendFriendReq,
} from "../controllers/friends.controller";
const router = express.Router();
router.route("/").get(listFriends);
router.route("/requests").get(listRequests);
router.route("/:friendId/requests").post(sendFriendReq);
router.route("/requests/:requestId").post(acceptOrRejectReq);
router.route("/:friendId/remove").post(removeFriend);
export default router;
