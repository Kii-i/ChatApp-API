import { StatusCodes } from "http-status-codes";
import {
  myProfileHandler,
  sendVerificationLinkHandler,
  updateEmailHandler,
  updatePasswordHandler,
  updateProfileHandler,
  verifyLinkHandler,
} from "../services/user.service";
import catchError from "../utils/catchError";
import {
  EmailSchema,
  UpdatePasswordSchema,
  UpdateProfileSchema,
} from "../zodSchema/user.schema";

export const updateProfile = catchError(async (req, res) => {
  const userId = req.user.id;
  const parsedData = UpdateProfileSchema.parse({ ...req.body });
  await updateProfileHandler(userId, parsedData);
  res.status(StatusCodes.OK).json({ success: true });
});

export const myProfile = catchError(async (req, res) => {
  const userId = req.user.id;
  const user = await myProfileHandler(userId);
  res.status(StatusCodes.OK).json({ user });
});

export const updatePassword = catchError(async (req, res) => {
  const userId = req.user.id;
  const parsedData = UpdatePasswordSchema.parse({ ...req.body });
  const { confirmPassword: _, ...ParsedDts } = parsedData;
  await updatePasswordHandler(userId, ParsedDts);
  res.status(StatusCodes.OK).json({ success: true });
});

export const sendVerificationLink = catchError(async (req, res) => {
  const userId = req.user.id;
  await sendVerificationLinkHandler(userId);
  res.status(StatusCodes.OK).json({ success: true });
});
export const verifyLink = catchError(async (req, res) => {
  const userId = req.user.id;
  const token = String(req.query.token);
  await verifyLinkHandler(userId, token);
  res.status(StatusCodes.OK).json({ success: true });
});
export const updateEmail = catchError(async (req, res) => {
  const userId = req.user.id;
  const parsedData = EmailSchema.parse({ ...req.body });
  await updateEmailHandler(userId, parsedData);
  res.status(StatusCodes.OK).json({ success: true });
});
