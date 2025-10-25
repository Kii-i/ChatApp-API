import z from "zod";

export const SetChannelRolePermissionSchema = z.object({
  role: z.array(z.string()),
});
