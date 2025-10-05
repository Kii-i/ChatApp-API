import { StatusCodes } from "http-status-codes";
import {
  issueNewAccessToken,
  loginHandler,
  logoutHandler,
  otpVerifyHandler,
  passwordResetHandler,
  registerHandler,
  sendOtpHandler,
} from "../services/auth.service";
import catchError from "../utils/catchError";
import { removeAuthCookies, setAuthCookies } from "../utils/cookie";
import {
  LoginSchema,
  OtpSchema,
  PasswordResetSchema,
  RegisterSchema,
} from "../zodSchema/auth.schema";
import { logoutFromAllDeviceHandler } from "../services/auth.service";
import { EmailSchema } from "../zodSchema/user.schema";

export const register = catchError(async (req, res) => {
  const parsedData = RegisterSchema.parse({
    ...req.body,
  });
  const { accessToken, refreshToken, safeUser } = await registerHandler(
    parsedData
  );
  setAuthCookies({ res, accessToken, refreshToken });
  res.status(StatusCodes.CREATED).json({ safeUser });
});

export const login = catchError(async (req, res) => {
  const parsedData = LoginSchema.parse({ ...req.body });
  const { accessToken, refreshToken, safeUser } = await loginHandler(
    parsedData
  );
  setAuthCookies({ res, accessToken, refreshToken });
  res.status(StatusCodes.OK).json({ safeUser });
});

export const refresh = catchError(async (req, res) => {
  const responseData = {
    refreshToken: req.cookies.refreshToken,
  };
  const { accessToken, newRefreshToken: refreshToken } =
    await issueNewAccessToken(responseData);
  setAuthCookies({ res, accessToken, refreshToken });
  res.status(StatusCodes.OK).json({ success: true });
});

export const logout = catchError(async (req, res) => {
  const responseData = { userId: req.user.id };
  await logoutHandler(responseData);
  removeAuthCookies(res);
  res.status(StatusCodes.OK).json({ success: true });
});

export const logoutFromAllDevice = catchError(async (req, res) => {
  const userId = req.user.id;
  await logoutFromAllDeviceHandler(userId);
  res.status(StatusCodes.OK).json({ success: true });
});

export const sendOtp = catchError(async (req, res) => {
  const parsedData = EmailSchema.parse({ ...req.body });
  const { otpId } = await sendOtpHandler(parsedData);
  res
    .status(StatusCodes.OK)
    .json({ message: "Your Otp has been sent", meta: { otpId } });
});
export const verifyOtp = catchError(async (req, res) => {
  const parsedData = OtpSchema.parse({ ...req.body });
  await otpVerifyHandler(parsedData);
  res.status(StatusCodes.OK).json({ message: "Otp Verified" });
});

export const passwordReset = catchError(async (req, res) => {
  const parsedData = PasswordResetSchema.parse({ ...req.body });
  await passwordResetHandler(parsedData);
  res.status(StatusCodes.OK).json({ success: true });
});
