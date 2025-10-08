import express from "express";
import {
  createChannel,
  deleteChannel,
  getAllChannels,
  updateChannel,
} from "../controllers/channel.controller";
const router = express.Router();
router.route("/").get(getAllChannels).post(createChannel);
router.route("/:channelId/update").patch(updateChannel);
router.route("/:channelId/delete").delete(deleteChannel);

export default router;
