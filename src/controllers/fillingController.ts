import { Request, Response } from "express";
import { FillingService } from "../services/fillingService";
import { ApiError } from "../utils/ApiError";
import { IFilling } from "../@types/Filling";

export class FillingController {
  constructor() {}

  async getAll(req: Request, res: Response) {
    const fillingService = new FillingService();
    const fillings: IFilling[] | undefined = await fillingService.getAll();

    if (!fillings) throw new ApiError("failed to get the fillings", 500);

    return res.status(200).send({ fillings });
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
}
