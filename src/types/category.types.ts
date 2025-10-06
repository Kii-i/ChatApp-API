import { Category } from "@prisma/client";
import { NewOrderSchema } from "../zodSchema/category.schema";
import z from "zod";

type RequestData = {
  serverId: string;
  categoryId: string;
};
export type CreateCategoryType = (
  serverId: string,
  title: string
) => Promise<Category>;

export type UpdateCategoryType = (
  requestData: RequestData,
  title: string
) => Promise<Category>;
export type DeleteCategoryType = (requestData: RequestData) => Promise<void>;
export type GetAllCategoryType = (serverId: string) => Promise<Category[]>;
type UpdateCategoryOrderData = z.infer<typeof NewOrderSchema>;
export type UpdateCategoryOrderType = (
  serverId: string,
  data: UpdateCategoryOrderData
) => Promise<Category[]>;
