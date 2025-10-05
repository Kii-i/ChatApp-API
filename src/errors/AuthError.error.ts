import ApiError from "./ApiError.error";
import { StatusCodes } from "http-status-codes";

class AuthError extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export default AuthError;
