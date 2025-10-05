import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import SafeUser from "../constants/SafeUser";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "../constants/getEnv";

export type AccessTokenPayload = {
  userId: SafeUser["id"];
  email: SafeUser["email"];
  tokenVersion: SafeUser["tokenVersion"];
};
export type RefreshTokenPayload = {
  userId: SafeUser["id"];
  tokenVersion: SafeUser["tokenVersion"];
};
type SignOptionAndSecret = SignOptions & {
  secret: string;
};
type verifyOptionAndSecret = VerifyOptions & {
  secret: string;
};
export const accessTokenAndOptions: SignOptionAndSecret = {
  secret: JWT_ACCESS_SECRET,
  expiresIn: "15m",
};
export const refreshTokenAndOptions: SignOptionAndSecret = {
  secret: JWT_REFRESH_SECRET,
  expiresIn: "30d",
};

export const genToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionAndSecret
) => {
  const { secret, ...SignOpts } = options || accessTokenAndOptions;
  const token = jwt.sign(payload, secret, {
    ...SignOpts,
  });
  return token;
};

export const verifyToken = <Tpayload extends Object>(
  token: string,
  options?: verifyOptionAndSecret
) => {
  const { secret = JWT_ACCESS_SECRET, ...VerifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      ...VerifyOpts,
    }) as Tpayload;
    return { payload };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "error while verifying token" };
  }
};
