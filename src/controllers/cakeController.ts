import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeService } from "../services/cakeService";
import { ICake } from "../@types/Cake";
import { z } from "zod";
import { IQueryParamsGetAllCakes } from "../@types/QueryParams";
import { ReqBodyCreateCake, ReqBodyUpdateCake } from "../@types/ReqBody";
import { createCakeZodSchema } from "../utils/createCakeZodSchema";
import "dotenv/config";
import { getApiUrl } from "../utils/getApiUrl";

export class CakeController {
  constructor() {}

  async getAll(
    req: Request<{}, {}, {}, IQueryParamsGetAllCakes>,
    res: Response
  ) {
    const query = req.query;

    const url = getApiUrl();

    const cakeService = new CakeService();

    const { cakes, maxPages, nextUrl, prevUrl } = await cakeService.getAll(
      url,
      query
    );

    if (!cakes) {
      throw new ApiError("failed to find the cakes", 500);
    }

    return res.status(200).send({
      message: "get all cakes sucessfully",
      maxPages,
      cakes,
      prevUrl,
      nextUrl
    });
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new ApiError("id is required", 400);

    const cakeService = new CakeService();

    const cake: ICake | undefined = await cakeService
      .findById(id)
      .catch((_) => {
        throw new ApiError("this cake doesn't exists", 404);
      });

    return res.status(200).send({ cake });
  }

  async create(req: Request<{}, {}, { cake: string }>, res: Response) {
    const imageCake = req.file;
    const hostUrl = getApiUrl();

    const cakeParsed: ReqBodyCreateCake = JSON.parse(req.body.cake);

    if (!imageCake) throw new ApiError("imageCake is required", 400);

    try {
      const bodyValidated = createCakeZodSchema.parse(cakeParsed);

      const cakeService = new CakeService();

      const cake: ICake | undefined = await cakeService.create(
        hostUrl,
        imageCake,
        bodyValidated
      );

      if (!cake) throw new ApiError("failed to create cake", 500);

      return res.status(201).send({
        message: "cake created sucessfully",
        cake: cake
      });
    } catch (error: any) {
      if (error instanceof z.ZodError)
        throw new ApiError(error.errors[0].message, 400);

      throw error;
    }
  }

  async update(
    req: Request<{ id?: string }, {}, { cake: string }, {}>,
    res: Response
  ) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    const imageCake = req.file;
    const hostUrl = getApiUrl();

    const cakeParsed: ReqBodyUpdateCake = JSON.parse(req.body.cake);

    const schemaCreateCake = createCakeZodSchema.shape;

    const reqBodyValidation = z.object({
      name: schemaCreateCake.name.optional(),
      type: schemaCreateCake.type.optional(),
      categories: schemaCreateCake.categories.optional(),
      frosting: schemaCreateCake.frosting.nullable().optional(),
      fillings: schemaCreateCake.fillings.optional(),
      size: schemaCreateCake.size.optional(),
      sizesPossibles: schemaCreateCake.sizesPossibles.optional(),
      pricePerSize: schemaCreateCake.pricePerSize.optional(),
      customizableParts: schemaCreateCake.customizableParts.optional()
    });

    try {
      const bodyValidated: ReqBodyUpdateCake =
        reqBodyValidation.parse(cakeParsed);

      const isEmptyObj =
        Object.keys(bodyValidated).length === 0 ||
        Object.values(bodyValidated).every((value) => value === undefined);

      if (isEmptyObj && !imageCake) {
        throw new ApiError("you need send something to update", 400);
      }

      const cakeService = new CakeService();

      const cake: ICake | undefined = await cakeService.update(
        id,
        hostUrl,
        imageCake,
        bodyValidated
      );

      if (!cake) {
        throw new ApiError("failed to update cake", 500);
      }

      return res.status(200).send({
        message: "cake updated sucessfully",
        cake: cake
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new ApiError(error.errors[0].message, 400);
      }

      throw error;
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) throw new ApiError("id is required", 400);

    const cakeService = new CakeService();

    try {
      await cakeService.delete(id);
    } catch (error: any) {
      throw new ApiError("Failed to delete the cake", 400);
    }

    return res.status(200).send({ message: "cake deleted sucessfully" });
  }
}
