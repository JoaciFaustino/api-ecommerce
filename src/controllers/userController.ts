import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { UserService } from "../services/userService";
import { UserResponseDB } from "../@types/DBresponses";

export class UserController {
  constructor() {}

  async findById(req: Request, res: Response) {
    const userService = new UserService();

    const decodedUserId = req.body.decodedUserId;
    const userId = req.params.id;

    if (decodedUserId !== userId) throw new ApiError("unauthorized", 401);

    const user: UserResponseDB = await userService.findById(req.params.id);

    if (!user) throw new ApiError("user not find", 404);

    return res.status(200).send({ user });
  }
}
