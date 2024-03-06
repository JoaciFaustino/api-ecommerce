import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

export class AuthMiddleware {
  constructor() {}

  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const headerAuth = req.headers.authorization;

    if (!headerAuth) throw new ApiError("you isn't logged", 401);

    const [bearer, token] = headerAuth?.split(" ");

    if (
      headerAuth?.split(" ").length !== 2 ||
      !bearer ||
      !token ||
      bearer !== "Bearer"
    ) {
      throw new ApiError("you isn't logged", 401);
    }

    try {
      type jwtDecodedType = {
        id: string;
        role: string;
        iat: number;
        exp: number;
      };

      const jwtDecoded = jwt.verify(
        token,
        process.env.JWT_SECRET || ""
      ) as jwtDecodedType;

      if (jwtDecoded.id) {
        req.body.userId = jwtDecoded.id as string;
      }

      next();
    } catch (error: any) {
      throw new ApiError("you isn't logged", 401);
    }
  }
}
