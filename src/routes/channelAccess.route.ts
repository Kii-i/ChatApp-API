import express from "express";
import {
  deleteChannelRolePermission,
  getChannelRolePermissions,
  setChannelRolePermission,
} from "../controllers/channelAccess.controller";

const router = express.Router();
router
  .route("/")
  .get(getChannelRolePermissions)
  .post(setChannelRolePermission)
  .delete(deleteChannelRolePermission);

export default router;
