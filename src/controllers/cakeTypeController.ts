import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeTypeService } from "../services/cakeTypeService";
import { BaseQueryParams } from "../@types/QueryParams";

export class CakeTypeController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, BaseQueryParams>, res: Response) {
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;

    const cakeTypeService = new CakeTypeService();
    const { cakeTypes, maxPages, nextUrl, prevUrl } =
      await cakeTypeService.getAll(url, req.query);

    if (!cakeTypes) {
      throw new ApiError("failed do get the cake types", 500);
    }

    return res.status(200).send({ cakeTypes, maxPages, nextUrl, prevUrl });
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
