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

    res.status(200).send({ fillings });
  }

  async create(req: Request, res: Response) {
    const { name, price } = req.body;

    if (!name) throw new ApiError("name is required", 400);
    if (!price) throw new ApiError("price is required", 400);

    const fillingService = new FillingService();
    const fillingCreated = await fillingService.create(name, price);

    if (!fillingCreated)
      throw new ApiError("failed to create the filling", 500);

    res.status(200).send({
      message: "filling created sucessfully",
      filling: fillingCreated
    });
  }
}
