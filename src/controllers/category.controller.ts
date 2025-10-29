import { StatusCodes } from "http-status-codes";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoryHandler,
  updateCategoryHandler,
  updateCategoryOrderHandler,
} from "../services/category.service";
import catchError from "../utils/catchError";
import {
  CreateCategorySchema,
  NewOrderSchema,
  UpdateCategorySchema,
} from "../zodSchema/category.schema";

export const createCategory = catchError(async (req, res) => {
  const requestData = {
    serverId: req.params.serverId,
    userId: req.user.id,
  };
  const { title } = CreateCategorySchema.parse(req.body);
  const category = await createCategoryHandler(requestData, title);
  res.status(StatusCodes.CREATED).json({ category });
});

export const updateCategory = catchError(async (req, res) => {
  const requestData = {
    serverId: req.params.serverId,
    categoryId: req.params.categoryId,
    userId: req.user.id,
  };
  const { title } = UpdateCategorySchema.parse(req.body);
  const category = await updateCategoryHandler(requestData, title);
  res.status(StatusCodes.OK).json({ category });
});

export const deleteCategory = catchError(async (req, res) => {
  const requestData = {
    serverId: req.params.serverId,
    categoryId: req.params.categoryId,
    userId: req.user.id,
  };
  await deleteCategoryHandler(requestData);
  res.status(StatusCodes.OK).json({
    message: `Category with the id: ${requestData.categoryId} has been deleted`,
  });
});

export const getAllCategory = catchError(async (req, res) => {
  const requestData = {
    serverId: req.params.serverId,
    userId: req.user.id,
  };
  const categories = await getAllCategoryHandler(requestData);
  res.status(StatusCodes.OK).json({ categories });
});

export const updateCategoryOrder = catchError(async (req, res) => {
  const requestData = {
    serverId: req.params.serverId,
    userId: req.user.id,
  };
  const parsedData = NewOrderSchema.parse(req.body);
  const categories = await updateCategoryOrderHandler(requestData, parsedData);
  res.status(StatusCodes.OK).json({ categories });
});
