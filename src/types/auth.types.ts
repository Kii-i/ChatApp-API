import z from "zod";
import SafeUser from "../constants/SafeUser";
import {
  LoginSchema,
  OtpSchema,
  PasswordResetSchema,
  RegisterSchema,
} from "../zodSchema/auth.schema";
import { EmailSchema } from "../zodSchema/user.schema";

type HandlerReturnType = {
  safeUser: SafeUser;
  accessToken: string;
  refreshToken: string;
};
type RegisterHandlerData = z.infer<typeof RegisterSchema>;
export type RegisterHandlerType = (
  data: RegisterHandlerData
) => Promise<HandlerReturnType>;

type LoginHandlerData = z.infer<typeof LoginSchema>;
export type LoginHandlerType = (
  data: LoginHandlerData
) => Promise<HandlerReturnType>;

export type IssueNewAccessTokenType = (responseData: {
  refreshToken: string;
}) => Promise<{ accessToken: string; newRefreshToken: string }>;

type SendOtpData = z.infer<typeof EmailSchema>;
export type SendOtpType = (data: SendOtpData) => Promise<{ otpId: string }>;

type OtpVerifyData = z.infer<typeof OtpSchema>;
export type OtpVerifyType = (data: OtpVerifyData) => Promise<void>;

type PasswordResetData = z.infer<typeof PasswordResetSchema>;
export type passwordResetType = (data: PasswordResetData) => Promise<void>;
