import { Request, Response } from "express";
import { FillingService } from "../services/fillingService";
import { ApiError } from "../utils/ApiError";
import { IFilling } from "../@types/Filling";
import { BaseQueryParams } from "../@types/QueryParams";
import { ReqBodyUpdateFilling } from "../@types/ReqBody";
import "dotenv/config";

export class FillingController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, BaseQueryParams>, res: Response) {
    const protocol = process.env.API_PROTOCOL || "https";
    const url = protocol + "://" + req.get("host") + req.originalUrl;

    const fillingService = new FillingService();
    const { maxPages, nextUrl, prevUrl, fillings } =
      await fillingService.getAll(url, req.query);

    if (!fillings) {
      throw new ApiError("failed to get the fillings", 500);
    }

    return res.status(200).send({ maxPages, nextUrl, prevUrl, fillings });
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;

    if (!name || typeof name !== "string") {
      throw new ApiError("name is required and must be string", 400);
    }

    if (!price || typeof parseFloat(price) !== "number") {
      throw new ApiError("price is required and must be number", 400);
    }

    const fillingService = new FillingService();
    const fillingCreated = await fillingService.create(name, parseFloat(price));

    if (!fillingCreated) {
      throw new ApiError("failed to create the filling", 500);
    }

    return res.status(200).send({
      message: "filling created sucessfully",
      filling: fillingCreated
    });
  }

  async update(
    req: Request<{ id?: string }, {}, ReqBodyUpdateFilling, {}>,
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

    const fillingService = new FillingService();

    const filling = await fillingService.update(id, name, price);

    if (!filling) {
      throw new ApiError("failed to update the filling", 400);
    }

    return res.status(200).send({
      message: "filling updated sucessfully",
      filling
    });
  }

  async delete(req: Request<{ id?: string }, {}, {}, {}>, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    const fillingService = new FillingService();

    try {
      await fillingService.delete(id);
    } catch (error) {
      throw new ApiError("Failed to delete the filling", 400);
    }

    return res.status(200).send({ message: "Filling deleted successfully" });
  }
}
