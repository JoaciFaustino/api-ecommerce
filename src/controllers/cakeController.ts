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

    const cake: CakeResponseDB = await cakeService
      .create(type, pricing, frosting, filling, size)
      .catch((error: any) => {
        throw new ApiError("Failed to create the cake", 400);
      });

    res.status(200).send({ message: "cake created sucessfully", cake: cake });
  }

  async update(req: Request, res: Response) {
    const { type, pricing, frosting, filling, size } = req.body;

    const id = req.params.id;

    if (!id) throw new ApiError("id is required", 400);

    if (!type && !pricing && !frosting && !filling && !size)
      throw new ApiError("you need send some info to update", 400);

    const cakeService = new CakeService();

    const cake: CakeResponseDB = await cakeService
      .update(id, type, pricing, frosting, filling, size)
      .catch((error: any) => {
        throw new ApiError("Failed to update the cake", 400);
      });

    res.status(200).send({ message: "cake updated sucessfully", cake: cake });
  }
}
