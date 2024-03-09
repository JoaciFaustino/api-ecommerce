import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeService } from "../services/cakeService";
import { CakeResponseDB } from "../@types/DBresponses";

export class CakeController {
  constructor() {}

  async getById(req: Request, res: Response) {
    res.status(200).send({ message: "passed through the middleware" });
  }

  async create(req: Request, res: Response) {
    const { type, pricing, frosting, filling, size } = req.body;

    if (!type) throw new ApiError("type is required", 400);

    if (!pricing) throw new ApiError("pricing is required", 400);

    if (!size) throw new ApiError("size is required", 400);

    const cakeService = new CakeService();

    const cake: CakeResponseDB = await cakeService.create(
      type,
      pricing,
      frosting,
      filling,
      size
    );

    res.status(200).send({ message: "cake created sucessfully", cake: cake });
  }
}
