import { NextFunction, Request, Response } from "express";

type catchErrorType = (
  asyncFunc: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchError: catchErrorType = (asyncFunc) => async (req, res, next) => {
  try {
    await asyncFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default catchError;
