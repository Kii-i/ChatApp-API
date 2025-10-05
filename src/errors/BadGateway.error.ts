import { StatusCodes } from "http-status-codes";
import ApiError from "./ApiError.error";

class BadGateway extends ApiError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_GATEWAY);
  }
}
export default BadGateway;
