import { Category } from "@prisma/client";
import { NewOrderSchema } from "../zodSchema/category.schema";
import z from "zod";

type RequestData = {
  userId: string;
  serverId: string;
  categoryId: string;
};
export type CreateCategoryType = (
  requestData: Omit<RequestData, "categoryId">,
  title: string
) => Promise<Category>;

export type UpdateCategoryType = (
  requestData: RequestData,
  title: string
) => Promise<Category>;
export type DeleteCategoryType = (requestData: RequestData) => Promise<void>;
export type GetAllCategoryType = (
  requestData: Omit<RequestData, "categoryId">
) => Promise<Category[]>;
type UpdateCategoryOrderData = z.infer<typeof NewOrderSchema>;
export type UpdateCategoryOrderType = (
  requestData: Omit<RequestData, "categoryId">,
  data: UpdateCategoryOrderData
) => Promise<Category[]>;
