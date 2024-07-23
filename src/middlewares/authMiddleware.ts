import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import "dotenv/config";
import { AuthService } from "../services/authService";

export class AuthMiddleware {
  constructor() {}

  isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const authService = new AuthService();

    if (!req.headers.authorization)
      throw new ApiError("you isn't authenticated", 401);

    const { userId, role } = authService.auth(req.headers.authorization);

    if (!userId) throw new ApiError("you isn't authenticated", 401);

    req.body = { ...req.body, decodedUserId: userId, role: role };

    next();
  }

  isAdmin(req: Request, res: Response, next: NextFunction) {
    const authService = new AuthService();

    if (!req.headers.authorization)
      throw new ApiError("you isn't authenticated", 401);

    const { userId, role } = authService.auth(req.headers.authorization);

    if (role !== "admin") throw new ApiError("anauthorized", 401);

    req.body = { ...req.body, decodedUserId: userId, role: role };

    next();
  }
}
