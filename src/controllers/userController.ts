import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { UserService } from "../services/userService";

export class UserController {
  constructor() {}

  async findById(req: Request, res: Response) {
    const userService = new UserService();

    const user = await userService.findById(req.params.id);

    if (!user) {
      throw new ApiError("this user not exists", 404);
    }

    console.log(user);

    return res.status(200).send({ user });
  }
}
