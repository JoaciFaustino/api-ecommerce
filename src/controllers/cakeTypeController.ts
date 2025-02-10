import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeTypeService } from "../services/cakeTypeService";
import { BaseQueryParams } from "../@types/QueryParams";
import { ReqBodyUpdateCakeType } from "../@types/ReqBody";

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

  async create(req: Request<{}, {}, { type: string }, {}>, res: Response) {
    const { type } = req.body;

    if (!type || typeof type !== "string") {
      throw new ApiError("cake type is required and must be string", 400);
    }

    const cakeTypeService = new CakeTypeService();

    const cakeTypeCreated: string | undefined = await cakeTypeService.create(
      type
    );

    if (!cakeTypeCreated)
      throw new ApiError("failed to create the cake type", 400);

    return res.status(200).send({
      message: "cake type created sucessfully",
      cakeType: cakeTypeCreated
    });
  }

  async update(
    req: Request<{ id?: string }, {}, ReqBodyUpdateCakeType, {}>,
    res: Response
  ) {
    const { id } = req.params;
    const { type } = req.body;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    if (!type || typeof type !== "string") {
      throw new ApiError("cake type is required and must be string", 400);
    }

    const cakeTypeService = new CakeTypeService();

    const cakeType = await cakeTypeService.update(id, type);

    if (!cakeType) {
      throw new ApiError("failed to update the cake type", 400);
    }

    return res.status(200).send({
      message: "cake type updated sucessfully",
      cakeType
    });
  }

  async delete(req: Request<{ id?: string }, {}, {}, {}>, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    const cakeTypeService = new CakeTypeService();

    try {
      await cakeTypeService.delete(id);
    } catch (error) {
      throw new ApiError("Failed to delete the cake type", 400);
    }

    return res.status(200).send({ message: "cake type deleted sucessfully" });
  }
}
