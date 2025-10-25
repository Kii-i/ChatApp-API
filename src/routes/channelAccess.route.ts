import express from "express";
import {
  deleteChannelRolePermission,
  getChannelRolePermissions,
  setChannelRolePermission,
  updateChannelRolePermission,
} from "../controllers/channelAccess.controller";

const router = express.Router();
router.route("/").get(getChannelRolePermissions).post(setChannelRolePermission);
router.route("/:channelId/update").patch(updateChannelRolePermission);
router.route("/:channelId/delete").delete(deleteChannelRolePermission);

export default router;
