import z from "zod";
import SafeUser from "../constants/SafeUser";
import {
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

export type UpdateEmailType = (userId: string, email: string) => Promise<void>;

export type SendVerificationLinkType = (userId: string) => Promise<void>;

export type VerifyLinkType = (userId: string, token: string) => Promise<void>;
