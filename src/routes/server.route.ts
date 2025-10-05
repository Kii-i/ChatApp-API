import express from "express";
import {
  createServer,
  deleteServer,
  getServerDetails,
  joinServer,
  leaveServer,
  listServerJoined,
  listServerOwned,
  membersOnServer,
  updateServer,
} from "../controllers/server.controller";
const router = express.Router();
router.route("/").post(createServer);
router.route("/created").get(listServerOwned);
router.route("/joined").get(listServerJoined);

router.route("/:serverId/update").patch(updateServer);
router.route("/:serverId/members").get(membersOnServer);
router.route("/:serverId").get(getServerDetails);
router.route("/:serverId/join").post(joinServer);
router.route("/:serverId/leave").post(leaveServer);
router.route("/:serverId/delete").patch(deleteServer);
export default router;
