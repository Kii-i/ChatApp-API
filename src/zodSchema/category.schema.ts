import z from "zod";
const TitleSchema = z.string().min(1);

export const CreateCategorySchema = z.object({
  title: TitleSchema,
});
export const UpdateCategorySchema = z.object({
  title: TitleSchema,
});
export const NewOrderSchema = z.object({
  newOrder: z.number(),
  movedCategoryId: z.string(),
});
