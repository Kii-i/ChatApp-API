import { RequestHandler } from "express";
import AuthError from "../errors/AuthError.error";
import { AccessTokenPayload, verifyToken } from "../utils/jwt";
import checkUser from "../utils/checkUser";

const Authentication: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  if (!accessToken) throw new AuthError("Access denied");
  const { payload, error } = verifyToken<AccessTokenPayload>(accessToken);
  if (!payload) throw new AuthError(`Access denied: ${error}`);
  try {
    const user = await checkUser({ id: payload.userId });
    if (user.tokenVersion !== payload.tokenVersion)
      throw new AuthError("token version doesn't match");
    req.user = { id: payload.userId, email: payload.email };
    next();
  } catch (error) {
    next(error);
  }
};
export default Authentication;
