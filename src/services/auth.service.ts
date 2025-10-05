import { prisma } from "..";
import AuthError from "../errors/AuthError.error";
import BadRequestError from "../errors/badRequest.error";
import {
  IssueNewAccessTokenType,
  LoginHandlerType,
  OtpVerifyType,
  passwordResetType,
  RegisterHandlerType,
  SendOtpType,
} from "../types/auth.types";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import {
  getRefreshToken,
  removeRefreshToken,
  storeRefreshToken,
} from "../../redis/redisRefreshToken";
import checkUser from "../utils/checkUser";
import token from "../utils/token";
import { RefreshTokenPayload, verifyToken } from "../utils/jwt";
import { JWT_REFRESH_SECRET } from "../constants/getEnv";
import { randomInt } from "crypto";
import sendEmail from "../utils/sendEmail";
import BadGateway from "../errors/BadGateway.error";
import { otpEmailTemplate } from "../utils/emailTemplate";
import {
  removeOtp,
  storeOtp,
  getRedisOtp,
  verifyOtp,
  getOtpOptions,
} from "../../redis/redisOtp";
import { v4 as uuid } from "uuid";
import { LogoutAllType } from "../types/user.types";

//register user logic
export const registerHandler: RegisterHandlerType = async (data) => {
  const { username, email, password } = data;
  const userExists = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (userExists)
    throw new BadRequestError(`User with the email: ${email} already exists`);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: await hashPassword(password),
      avatarUrl: `https://avatar.iran.liara.run/username?username=${username}`,
    },
  });
  const refreshPayload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };
  const accessPayload = {
    ...refreshPayload,
    email: user.email,
  };
  const { accessToken, refreshToken } = token(accessPayload, refreshPayload);
  await storeRefreshToken(refreshToken, user.id);
  const { password: _, ...safeUser } = user;
  return { accessToken, refreshToken, safeUser };
};

// login user logic
export const loginHandler: LoginHandlerType = async (data) => {
  const { email, password } = data;
  const user = await checkUser({ email });
  if (!user) throw new BadRequestError(`no user found with email: ${email}`);

  const isPassCorrect = await comparePassword(user.password, password);
  if (!isPassCorrect)
    throw new BadRequestError("Incorrect username or password");
  const refreshPayload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };
  const accessPayload = {
    ...refreshPayload,
    email: user.email,
  };
  const { accessToken, refreshToken } = token(accessPayload, refreshPayload);
  await storeRefreshToken(refreshToken, user.id);
  const { password: _, ...safeUser } = user;
  return { accessToken, refreshToken, safeUser };
};

// logout user logic
export const logoutHandler = async (responseData: { userId: string }) => {
  const { userId } = responseData;
  await removeRefreshToken(userId);
};

// issue new token when accessToken expires
export const issueNewAccessToken: IssueNewAccessTokenType = async (
  responseData
) => {
  const { refreshToken } = responseData;
  if (!refreshToken) throw new AuthError("Access denied");
  const { payload, error: refreshError } = verifyToken<RefreshTokenPayload>(
    refreshToken,
    { secret: JWT_REFRESH_SECRET }
  );
  if (refreshError || !payload)
    throw new AuthError(
      `Access denied: ${refreshError ? refreshError : "payload not found"}`
    );
  const userId = payload.userId;
  const redisRefreshToken = await getRefreshToken(userId);
  if (refreshToken !== redisRefreshToken)
    throw new AuthError("Access denied: invalid token");
  const user = await checkUser({ id: userId });
  if (!user) throw new AuthError(`no user found with id: ${userId}`);
  const refreshPayload = {
    userId: user.id,
    tokenVersion: user.tokenVersion,
  };
  const accessPayload = {
    ...refreshPayload,
    email: user.email,
  };
  const { refreshToken: newRefreshToken, accessToken } = token(
    accessPayload,
    refreshPayload
  );
  await storeRefreshToken(newRefreshToken, userId);
  return { accessToken, newRefreshToken };
};

// this logic loges out user from every device he was connected to
export const logoutFromAllDeviceHandler: LogoutAllType = async (userId) => {
  await checkUser({ id: userId });
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      tokenVersion: {
        increment: 1,
      },
    },
  });
};

// this logic sends otp
export const sendOtpHandler: SendOtpType = async (data) => {
  const user = await checkUser({ email: data.email });
  const otpId = uuid();
  const otp = randomInt(100000, 999999).toString();
  await storeOtp(otp, otpId, user.id);
  const { error } = await sendEmail({
    to: user.email,
    ...otpEmailTemplate(otp, user.username),
  });
  if (error) throw new BadGateway(error.message ?? "Try again later");
  return { otpId };
};

// this logic verifies otp
export const otpVerifyHandler: OtpVerifyType = async ({ otp, otpId }) => {
  if (!otp || !otpId) throw new AuthError("please provide valid OTP");
  const redisOtp = await getRedisOtp(otpId);
  if (otp !== redisOtp) throw new AuthError("Invalid OTP");
  await verifyOtp(otpId);
};

// logic to reset password, when user is not logged in

export const passwordResetHandler: passwordResetType = async (data) => {
  const { newPassword, otpId } = data;
  const { userId, verified } = await getOtpOptions(otpId);
  if (!userId) throw new AuthError("OTP session not found or expired");
  if (verified !== "true") throw new AuthError("OTP not verified");
  await checkUser({ id: userId });
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await hashPassword(newPassword),
    },
  });
  await removeOtp(otpId);
};
