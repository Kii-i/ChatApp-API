import z from "zod";
import passwordRule from "../constants/passwordZodRule";

export const LoginSchema = z.object({
  email: z.email(),
  password: passwordRule,
});
export const RegisterSchema = LoginSchema.extend({
  username: z.string().min(3).max(15),
  confirmPassword: z.string(),
}).refine((data) => data.confirmPassword === data.password, {
  message: "Password doesn't match",
  path: ["confirmPassword"],
});
export const OtpSchema = z.object({
  otp: z.string().min(6).max(6),
  otpId: z.string(),
});
export const PasswordResetSchema = z.object({
  newPassword: passwordRule,
  otpId: z.string(),
});
