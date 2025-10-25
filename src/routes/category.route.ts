import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
  updateCategoryOrder,
} from "../controllers/category.controller";
const router = express.Router({ mergeParams: true });

router.route("/categories").post(createCategory).get(getAllCategory);
router.route("/categories/order").patch(updateCategoryOrder);
router
  .route("/categories/:categoryId")
  .patch(updateCategory)
  .delete(deleteCategory);

export default router;
