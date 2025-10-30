import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.error";

class ForbiddenError extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
export default ForbiddenError;
