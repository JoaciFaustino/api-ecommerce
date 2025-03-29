import { Request, Response } from "express";
import { FrostingService } from "../services/frostingService";
import { IFrosting } from "../@types/Frosting";
import { ApiError } from "../utils/ApiError";
import { BaseQueryParams } from "../@types/QueryParams";
import { ReqBodyUpdateFrosting } from "../@types/ReqBody";
import "dotenv/config";
import { getApiUrl } from "../utils/getApiUrl";

export class FrostingController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, BaseQueryParams>, res: Response) {
    const url = getApiUrl();

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

    return res.status(201).send({
      message: "frosting created sucessfully",
      frosting: frostingCreated
    });
  }

  async update(
    req: Request<{ id?: string }, {}, ReqBodyUpdateFrosting, {}>,
    res: Response
  ) {
    const { id } = req.params;
    const { name, price } = req.body;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    if (typeof name !== "string" && typeof name !== "undefined") {
      throw new ApiError("name must be string", 400);
    }

    if (
      (typeof price !== "number" && typeof price !== "undefined") ||
      (price && price < 0.5)
    ) {
      throw new ApiError(
        "price must be a positive number greater than 0.5",
        400
      );
    }

    const frostingService = new FrostingService();

    const frosting = await frostingService.update(id, name, price);

    if (!frosting) {
      throw new ApiError("failed to update the frosting", 400);
    }

    return res.status(200).send({
      message: "frosting updated sucessfully",
      frosting
    });
  }

  async delete(req: Request<{ id?: string }, {}, {}, {}>, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    const frostingService = new FrostingService();

    try {
      await frostingService.delete(id);
    } catch (error) {
      throw new ApiError("Failed to delete the frosting", 400);
    }

    return res.status(200).send({ message: "frosting deleted successfully" });
  }
}
