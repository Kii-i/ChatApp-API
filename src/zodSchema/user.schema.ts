import z from "zod";
import passwordRule from "../constants/passwordZodRule";

export const UpdateProfileSchema = z
  .object({
    username: z.string().min(3).max(15),
    avatarUrl: z.string(),
  })
  .strict()
  .partial()
  .refine(
    (data) => data.username !== undefined || data.avatarUrl !== undefined,
    {
      message: "At least one field is required",
    }
  );

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export const EmailSchema = z.object({
  email: z.email(),
});
