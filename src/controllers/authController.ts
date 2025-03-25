import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { AuthService } from "../services/authService";
import { ReqBodyLogin, ReqBodySignUp } from "../@types/ReqBody";
import { z } from "zod";
import { errorString } from "../utils/zod";

export class AuthController {
  constructor() {}

  async signUp(req: Request<{}, {}, ReqBodySignUp, {}>, res: Response) {
    const reqBodyValidation = z.object({
      name: z.string({ message: errorString("name", true) }).trim(),
      username: z.string({ message: errorString("username", true) }).trim(),
      email: z
        .string({ message: errorString("email", true) })
        .trim()
        .email({ message: "email is not valid" }),
      password: z
        .string({ message: errorString("password", true) })
        .min(8, { message: "password must be at least 8 characters long" })
        .trim(),
      confirmPassword: z
        .string({ message: errorString("confirmPassword", true) })
        .trim()
        .refine((value) => value === req.body.password, {
          message: "confirmPassword is not valid"
        })
    });

    try {
      const bodyValidated = reqBodyValidation.parse(req.body);

      const authService = new AuthService();

      const { name, username, email, password } = bodyValidated;

      const { user, token } = await authService.signUp(
        name,
        username,
        email,
        password
      );

      return res.status(201).send({
        message: "signup completed successfully",
        user: user,
        token: token
      });
    } catch (error: any) {
      if (error instanceof z.ZodError)
        throw new ApiError(error.errors[0].message, 400);

      throw error;
    }
  }

  async login(req: Request<{}, {}, ReqBodyLogin, {}>, res: Response) {
    const reqBodyValidation = z.object({
      email: z
        .string({ message: errorString("email", true) })
        .trim()
        .email({ message: "email is not valid" }),
      password: z
        .string({ message: errorString("password", true) })
        .min(8, { message: "password must be at least 8 characters long" })
        .trim()
    });

    try {
      const bodyValidated = reqBodyValidation.parse(req.body);

      const { email, password } = bodyValidated;

      const authService = new AuthService();
      const { user, token } = await authService.login(email, password);

      return res.status(200).send({
        message: "login completed successfully",
        user: user,
        token: token
      });
    } catch (error) {
      if (error instanceof z.ZodError)
        throw new ApiError(error.errors[0].message, 400);

      throw error;
    }
  }

  auth(req: Request, res: Response) {
    const { decodedUserId, role } = req.body;

    return res.status(200).send({
      message: "authenticate sucessfully",
      userId: decodedUserId,
      role
    });
  }
}
