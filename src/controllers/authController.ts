import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { AuthService } from "../services/authService";

export class AuthController {
  constructor() {}

  async signUp(req: Request, res: Response) {
    const { name, username, email, password, confirmPassword } = req.body;

    const authService = new AuthService();

    if (!name) throw new ApiError("name is required!", 400);

    if (!username) throw new ApiError("username is required", 400);

    if (!email) throw new ApiError("email is required", 400);

    if (!password) throw new ApiError("password is required", 400);

    if (password !== confirmPassword)
      throw new ApiError(
        "confirm password does not match the password provided",
        400
      );

    const { userId, token } = await authService.signUp(
      name,
      username,
      email,
      password
    );

    return res.status(200).send({ userId: userId, token: token });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const authService = new AuthService();

    if (!email) throw new ApiError("email is required", 400);

    if (!password) throw new ApiError("password is required", 400);

    const { userId, token } = await authService.login(email, password);

    return res.status(200).send({ userId: userId, token: token });
  }
}
