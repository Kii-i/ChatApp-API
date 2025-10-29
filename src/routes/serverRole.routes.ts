import express from "express";
import {
  assignRole,
  createRole,
  deleteRole,
  getAllRole,
  getUserRole,
} from "../controllers/serverRole.controller";

const router = express.Router({ mergeParams: true });
router.route("/roles").get(getAllRole).post(createRole);
router.route("/roles/:roleId").delete(deleteRole);
router.route("/users/:userId/roles").get(getUserRole);
router.route("/users/:userId/roles/:roleId").post(assignRole);
export default router;
