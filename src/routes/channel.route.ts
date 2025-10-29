import express from "express";
import {
  createChannel,
  deleteChannel,
  getAllChannels,
  moveChannel,
  updateChannel,
} from "../controllers/channel.controller";
const router = express.Router({ mergeParams: true });
router.route("/channels").get(getAllChannels);
router.route("/channels/:channelId").delete(deleteChannel).patch(updateChannel);
router.route("/categories/:categoryId/channels").post(createChannel);
router.route("/channels/:channelId/move").patch(moveChannel);

export default router;
