import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
  updateCategoryOrder,
} from "../controllers/category.controller";
const router = express.Router({ mergeParams: true });

router.route("/").post(createCategory).get(getAllCategory);
router.route("/order").patch(updateCategoryOrder);
router.route("/:categoryId").patch(updateCategory).delete(deleteCategory);

export default router;
