import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

type SetAuthCookiesType = (params: {
  res: Response;
  accessToken: string;
  refreshToken: string;
}) => void;
const secure = process.env.NODE_ENV !== "development";
const defaults: CookieOptions = {
  httpOnly: true,
  secure,
  sameSite: true,
};
const accessTokenDefault: CookieOptions = {
  ...defaults,
  maxAge: Number(fifteenMinutesFromNow()),
};
const refreshTokenDefault: CookieOptions = {
  ...defaults,
  maxAge: Number(thirtyDaysFromNow()),
  //refresh token will be sent only on this path
  path: "/auth/refresh",
};
export const setAuthCookies: SetAuthCookiesType = ({
  res,
  accessToken,
  refreshToken,
}) => {
  res
    .cookie("accessToken", accessToken, { ...accessTokenDefault })
    .cookie("refreshToken", refreshToken, refreshTokenDefault);
};
export const removeAuthCookies = (res: Response) => {
  res.clearCookie("accessToken").clearCookie("refreshToken");
};
