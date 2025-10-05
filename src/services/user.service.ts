import { prisma } from "..";
import { BASE_URL } from "../constants/getEnv";
import BadRequestError from "../errors/badRequest.error";
import {
  MyProfileType,
  sendVerificationLinkType,
  UpdateEmailType,
  UpdatePasswordType,
  UpdateProfileType,
  verifyLinkType,
} from "../types/user.types";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import checkUser from "../utils/checkUser";
import { v4 as uuid } from "uuid";
import sendEmail from "../utils/sendEmail";
import { VerifyLinkEmailTemplate } from "../utils/emailTemplate";
import {
  getRedisVerifyField,
  getSpecificRedisVerifyField,
  removeVerificationLink,
  setVerifyTrue,
  storeVerificationLink,
} from "../../redis/redisVerifyLink";
import BadGateway from "../errors/BadGateway.error";
import AuthError from "../errors/AuthError.error";

// update user logic
export const updateProfileHandler: UpdateProfileType = async (userId, data) => {
  await checkUser({ id: userId });
  await prisma.user.update({
    where: {
      id: userId,
    },
    data,
  });
};

// this logic sends the logged in user when he clicks his own profile
export const myProfileHandler: MyProfileType = async (userId) => {
  const user = await checkUser({ id: userId });
  const { password: _, ...safeUser } = user;
  return safeUser;
};

// update password route for user who is logged in
export const updatePasswordHandler: UpdatePasswordType = async (
  userId,
  data
) => {
  const { oldPassword, newPassword } = data;
  const user = await checkUser({ id: userId });
  const isMatch = await comparePassword(user.password, oldPassword);
  if (!isMatch) throw new BadRequestError("Incorrect password");
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: await hashPassword(newPassword),
    },
  });
};

// send verification link
export const sendVerificationLinkHandler: sendVerificationLinkType = async (
  userId
) => {
  const user = await checkUser({ id: userId });
  const alreadyLinkSent = await getRedisVerifyField(userId);
  if (alreadyLinkSent)
    throw new BadRequestError("verification link already sent");
  const verifyLinkId = uuid();
  const url = `${BASE_URL}/api/user/verify?token=${verifyLinkId}`;
  const { error } = await sendEmail({
    to: user.email,
    ...VerifyLinkEmailTemplate(url, user.username),
  });
  if (error) throw new BadGateway(error.message);
  await storeVerificationLink(verifyLinkId, userId);
};
// verify link
export const verifyLinkHandler: verifyLinkType = async (userId, token) => {
  if (!token) throw new AuthError("Verify link expired or invalid");
  const value = await getSpecificRedisVerifyField(userId, "verifyLinkId");
  if (value !== token) throw new AuthError("Verify link expired or invalid");
  await setVerifyTrue(userId);
};
// this logic updates email then remove verification link
export const updateEmailHandler: UpdateEmailType = async (userId, data) => {
  const isVerify = await getSpecificRedisVerifyField(userId, "verified");
  if (!isVerify || isVerify === "false")
    throw new AuthError("Verify link expired or invalid");
  await checkUser({ id: userId });
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: data.email,
    },
  });
  await removeVerificationLink(userId);
};
