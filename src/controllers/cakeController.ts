import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { CakeService } from "../services/cakeService";
import {
  CUSTOMIZABLE_PARTS_ENUM,
  ICake,
  SIZES_POSSIBLES_ENUM
} from "../@types/Cake";
import { z } from "zod";
import {
  errorArrayString,
  errorEnum,
  errorNumberPositive,
  errorObj,
  errorString
} from "../utils/zod";
import { capitalize } from "../utils/capitalizeString";
import { IQueryParamsGetAll } from "../@types/QueryParams";
import { ReqBodyCreateCake } from "../@types/ReqBody";

export class CakeController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, IQueryParamsGetAll>, res: Response) {
    const query = req.query;

    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    const cakeService = new CakeService();

    const { cakes, maxPages, nextUrl, prevUrl } = await cakeService.getAll(
      url,
      query
    );

    if (!cakes) throw new ApiError("failed to find the cakes", 500);

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
    const hostUrl = req.protocol + "://" + req.get("host") + "/api/";

    const cakeParsed: ReqBodyCreateCake = JSON.parse(req.body.cake);

    if (!imageCake) throw new ApiError("imageCake is required", 400);

    const fillingsValidation = z
      .array(z.string({ message: errorString("fillings") }).trim(), {
        message: errorArrayString("fillings")
      })
      .optional();

    const frostingValidation = z
      .string({ message: errorString("frosting") })
      .trim()
      .optional();

    const pricePerSizeValidation = z.object(
      {
        pequeno: z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional(),
        medio: z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional(),
        grande: z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional(),
        "extra-grande": z
          .number()
          .min(1, {
            message: errorNumberPositive("the prices in pricePerSize")
          })
          .optional()
      },
      { message: errorObj("pricePerSize") }
    );

    const reqBodyValidation = z.object(
      {
        name: z
          .string({ message: errorString("name", true) })
          .trim()
          .transform((name) => capitalize(name)),
        type: z.string({ message: errorString("type", true) }).trim(),
        categories: z
          .array(z.string({ message: errorString("category") }).trim(), {
            message: errorArrayString("categories")
          })
          .optional(),
        frosting: frostingValidation,
        fillings: fillingsValidation,
        size: z.enum(SIZES_POSSIBLES_ENUM, { message: errorEnum("size") }),
        sizesPossibles: z.array(
          z.enum(SIZES_POSSIBLES_ENUM, { message: errorEnum("sizesPossibles") })
        ),
        pricePerSize: pricePerSizeValidation,
        customizableParts: z.array(
          z.enum(CUSTOMIZABLE_PARTS_ENUM, {
            message: errorEnum("customizableParts")
          }),
          { message: errorEnum("customizableParts") }
        )
      },
      { message: "cake is not valid" }
    );

    try {
      const bodyValidated = reqBodyValidation.parse(cakeParsed);

      const cakeService = new CakeService();

      const cake: ICake | undefined = await cakeService.create(
        hostUrl,
        imageCake,
        bodyValidated
      );

      if (!cake) throw new ApiError("failed to create cake", 500);

      return res.status(200).send({
        message: "cake created sucessfully",
        cake: cake
      });
    } catch (error: any) {
      if (error instanceof z.ZodError)
        throw new ApiError(error.errors[0].message, 400);

      throw error;
    }
  }

  async update(req: Request, res: Response) {
    const { type, pricing, frosting, fillings, size } = req.body;
    const { id } = req.params;
    const imageCake = req.file;

    const hostUrl = req.protocol + "://" + req.get("host") + "/api/";

    if (!id) throw new ApiError("id is required", 400);

    if (!type && !pricing && !frosting && !fillings && !size && !imageCake)
      throw new ApiError("you need send something to update", 400);

    const cakeService = new CakeService();

    const cake: ICake | undefined = await cakeService.update(
      hostUrl,
      id,
      type,
      pricing,
      imageCake,
      frosting,
      fillings,
      size
    );

    if (!cake) {
      throw new ApiError("failed to create cake", 500);
    }

    return res.status(200).send({
      message: "cake updated sucessfully",
      cake: cake
    });
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
