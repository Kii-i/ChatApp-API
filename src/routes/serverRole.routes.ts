import express from "express";
import {
  assignRole,
  createRole,
  deleteRole,
  getAllRole,
} from "../controllers/serverRole.controller";

const router = express.Router();
router.route("/role").get(getAllRole);
router.route("/user/:userId").post(createRole);
router.route("/user/:userId/role/:roleId/delete").delete(deleteRole);
router.route("/user/:userId/role/:roleId/assignRole").post(assignRole);
export default router;
