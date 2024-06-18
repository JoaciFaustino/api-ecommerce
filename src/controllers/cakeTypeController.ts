import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeTypeService } from "../services/cakeTypeService";
import { ICakeType } from "../@types/CakeType";
import { z } from "zod";

export class CakeTypeController {
  constructor() {}

  async getAll(req: Request, res: Response) {
    const cakeTypeService = new CakeTypeService();
    const cakeTypes: ICakeType[] | undefined = await cakeTypeService.getAll();

    if (!cakeTypes) throw new ApiError("failed do get the cake types", 500);

    return res.status(200).send({ cakeTypes });
  }

  async create(req: Request, res: Response) {
    const { cakeType } = req.body;

    if (!cakeType || typeof cakeType !== "string")
      throw new ApiError("cake type is required and must be string", 400);

    const cakeTypeService = new CakeTypeService();

    const cakeTypeCreated: string | undefined = await cakeTypeService.create(
      cakeType
    );

    if (!cakeTypeCreated)
      throw new ApiError("failed to create the cake type", 400);

    return res.status(200).send({
      message: "cake type created sucessfully",
      cakeType: cakeTypeCreated
    });
  }
}
