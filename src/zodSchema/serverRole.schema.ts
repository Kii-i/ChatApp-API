import z from "zod";

export const CreateRoleSchema = z.object({
  title: z.string().trim().max(15).min(1),
});
