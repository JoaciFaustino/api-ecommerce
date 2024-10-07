import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { ApiError } from "../utils/ApiError";
import { ICategory } from "../@types/Category";
import { BaseQueryParams } from "../@types/QueryParams";

export class CategoryController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, BaseQueryParams>, res: Response) {
    const url = req.protocol + "://" + req.get("host") + req.originalUrl;

    const categoryService = new CategoryService();
    const { maxPages, nextUrl, prevUrl, categories } =
      await categoryService.getAll(url, req.query);

    if (!categories) {
      throw new ApiError("failed to get the categories", 500);
    }

    return res.status(200).send({ categories, maxPages, nextUrl, prevUrl });
  }

  async create(req: Request, res: Response) {
    const { category } = req.body;

    if (!category || typeof category !== "string") {
      throw new ApiError("category is required", 400);
    }

    const categoryService = new CategoryService();
    const categoryCreated = await categoryService.create(category);

    if (!categoryCreated) {
      throw new ApiError("failed to create the category", 500);
    }

    return res.status(200).send({
      message: "category created sucessfully",
      category: categoryCreated
    });
  }
}
