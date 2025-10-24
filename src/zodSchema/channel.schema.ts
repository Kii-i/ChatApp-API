import z from "zod";

export const createChannelSchema = z.object({
  title: z.string().min(1).max(15),
});
export const UpdateChannelSchema = createChannelSchema;
export const MoveChannelSchema = z.object({
  targetOrder: z.number(),
  targetCategoryId: z.string(),
});
