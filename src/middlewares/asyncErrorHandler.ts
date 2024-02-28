import { Handler, NextFunction, Request, Response } from "express";

export const asyncErrorHandler = (controllerCallback: Handler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(controllerCallback(req, res, next)).catch(
      (error: any) => {
        next(error);
      }
    );
  };
};
