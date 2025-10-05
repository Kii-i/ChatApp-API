import z from "zod";

export const CreateServerSchema = z.object({
  title: z.string().min(1).max(60).trim(),
  avatarUrl: z.string().url("Invalid URL").optional(),
});
export const UpdateServerSchema = CreateServerSchema.partial()
  .strict()
  .refine((data) => data.title !== undefined || data.avatarUrl !== undefined, {
    message: "At least one field is required",
  }); // 🚩
export const leaveServerSchema = z.object({
  newOwnerId: z.string().optional(),
});
