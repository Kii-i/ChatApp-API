import z from "zod";
import SafeUser from "../constants/SafeUser";
import {
  EmailSchema,
  UpdatePasswordSchema,
  UpdateProfileSchema,
} from "../zodSchema/user.schema";

type UpdateProfileData = z.infer<typeof UpdateProfileSchema>;
export type UpdateProfileType = (
  userId: string,
  data: UpdateProfileData
) => Promise<void>;

export type MyProfileType = (userId: string) => Promise<SafeUser>;

type UpdatePasswordData = z.infer<typeof UpdatePasswordSchema>;
export type UpdatePasswordType = (
  userId: string,
  data: Omit<UpdatePasswordData, "confirmPassword">
) => Promise<void>;

export type LogoutAllType = (userId: string) => Promise<void>;

type UpdateEmailData = z.infer<typeof EmailSchema>;
export type UpdateEmailType = (
  userId: string,
  data: UpdateEmailData
) => Promise<void>;

export type sendVerificationLinkType = (userId: string) => Promise<void>;

export type verifyLinkType = (userId: string, token: string) => Promise<void>;
