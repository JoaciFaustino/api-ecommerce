import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { UserService } from "../services/userService";
import { userResponseDB } from "../@types/DBresponses";
import { objectIdIsValid } from "../utils/objectIdIsValid";

export class UserController {
  constructor() {}

  async findById(req: Request, res: Response) {
    const userService = new UserService();

    const user: userResponseDB = await userService.findById(req.params.id);

    if (!user) {
      throw new ApiError("user not find", 404);
    }

    console.log(user);

    return res.status(200).send({ user });
  }
}
