import { Response, Request, NextFunction, Handler } from "express";
import { ApiError } from "../utils/ApiError";

const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error.message);
  console.log("");

  if (error instanceof ApiError) {
    return res.status(error.status).send({ message: error.message });
  } else {
    return res.status(500).send({ message: "Internal server error" });
  }
};

export { errorMiddleware };
