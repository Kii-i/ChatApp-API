import { StatusCodes } from "http-status-codes";
import { createCategoryHandler } from "../services/category.service";
import catchError from "../utils/catchError";
import { CreateCategorySchema } from "../zodSchema/category.schema";

export const createCategory = catchError(async (req, res) => {
  const serverId = req.params.serverId;
  const { title } = CreateCategorySchema.parse(req.body);
  const category = await createCategoryHandler(serverId, title);
  res.status(StatusCodes.CREATED).json({ category });
});
export const updateCategory = catchError(async (req, res) => {});
export const deleteCategory = catchError(async (req, res) => {});
export const getAllCategory = catchError(async (req, res) => {});
export const updateCategoryOrder = catchError(async (req, res) => {});
