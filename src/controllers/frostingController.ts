import { Request, Response } from "express";
import { FrostingService } from "../services/frostingService";
import { IFrosting } from "../@types/Frosting";
import { ApiError } from "../utils/ApiError";
import { BaseQueryParams } from "../@types/QueryParams";

export class FrostingController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, BaseQueryParams>, res: Response) {
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;

    const frostingService = new FrostingService();
    const { maxPages, nextUrl, prevUrl, frostings } =
      await frostingService.getAll(url, req.query);

    if (!frostings) {
      throw new ApiError("failed to get the frostings", 500);
    }

    return res.status(200).send({ maxPages, nextUrl, prevUrl, frostings });
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;

    if (!name || typeof name !== "string") {
      throw new ApiError("name is required and must be string", 400);
    }

    if (!price || typeof parseFloat(price) !== "number") {
      throw new ApiError("price is required and must be number", 400);
    }

    const frostingService = new FrostingService();
    const frostingCreated: IFrosting | undefined = await frostingService.create(
      name,
      parseFloat(price)
    );

    if (!frostingCreated)
      throw new ApiError("failed to create the frosting", 400);

    return res.status(400).send({
      message: "frosting created sucessfully",
      frosting: frostingCreated
    });
  }
}
