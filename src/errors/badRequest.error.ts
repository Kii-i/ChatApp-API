import ApiError from "./ApiError.error";

import { StatusCodes } from "http-status-codes";
class BadRequestError extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
export default BadRequestError;
