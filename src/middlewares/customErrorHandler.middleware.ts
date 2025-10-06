import { ErrorRequestHandler } from "express";
import ApiError from "../errors/ApiError.error";
import z from "zod";
import { StatusCodes } from "http-status-codes";
const CustomErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    res.status(StatusCodes.FORBIDDEN).json({ err });
    return;
  }
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ err: err instanceof Error ? err.message : err });
};

export default CustomErrorHandler;
