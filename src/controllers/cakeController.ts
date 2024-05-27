import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeService } from "../services/cakeService";
import { CakeResponseDB } from "../@types/DBresponses";

export class CakeController {
  constructor() {}

  async getAll(req: Request, res: Response) {
    const query = req.query;

    const limit = parseInt(query.limit as string) || 20;
    const page = parseInt(query.page as string) || 1;
    const sortBy = (query.sortBy as string) || "popularity";

    const cakeService = new CakeService();

    const { cakes, maxPages } = await cakeService.getAll(limit, page, sortBy);

    res.status(200).send({
      message: "get all cakes sucessfully",
      maxPages: maxPages,
      cakes: cakes
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new ApiError("id is required", 400);

    const cakeService = new CakeService();

    const cake: CakeResponseDB = await cakeService
      .findById(id)
      .catch((error: any) => {
        throw new ApiError("Failed to find the cake", 500);
      });

    res.status(200).send({
      message: "passed through the middleware",
      cake: cake
    });
  }

  async createMany(req: Request, res: Response) {
    //to do later
  }

  async create(req: Request, res: Response) {
    const { type, pricing, frosting, filling, size } = req.body;
    const imageCake = req.file;

    const hostUrl = req.protocol + "://" + req.get("host") + "/api/";

    if (!type) throw new ApiError("type is required", 400);

    if (!pricing) throw new ApiError("pricing is required", 400);

    if (!size) throw new ApiError("size is required", 400);

    if (!imageCake) throw new ApiError("imageCake is required", 400);

    const cakeService = new CakeService();

    const cake: CakeResponseDB = await cakeService
      .create(hostUrl, type, pricing, imageCake, frosting, filling, size)
      .catch((error: any) => {
        throw new ApiError("Failed to create the cake", 400);
      });

    res.status(200).send({ message: "cake created sucessfully", cake: cake });
  }

  async update(req: Request, res: Response) {
    const { type, pricing, frosting, filling, size } = req.body;
    const { id } = req.params;
    const imageCake = req.file;

    const hostUrl = req.protocol + "://" + req.get("host") + "/api/";

    if (!id) throw new ApiError("id is required", 400);

    if (!type && !pricing && !frosting && !filling && !size && !imageCake)
      throw new ApiError("you need send something to update", 400);

    const cakeService = new CakeService();

    const cake: CakeResponseDB = await cakeService
      .update(hostUrl, id, type, pricing, imageCake, frosting, filling, size)
      .catch((error: any) => {
        throw new ApiError("Failed to update the cake", 400);
      });

    res.status(200).send({ message: "cake updated sucessfully", cake: cake });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new ApiError("id is required", 400);

    const cakeService = new CakeService();

    await cakeService.delete(id).catch((error: any) => {
      throw new ApiError("Failed to delete the cake", 400);
    });

    res.status(200).send({ message: "cake deleted sucessfully" });
  }
}
