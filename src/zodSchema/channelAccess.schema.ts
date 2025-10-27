import z from "zod";

export const SetChannelRolePermissionSchema = z.object({
  roleIds: z.array(z.string()),
});
export const RemoveChannelRolePermissionSchema = SetChannelRolePermissionSchema;
