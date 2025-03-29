import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { ApiError } from "../utils/ApiError";
import { BaseQueryParams } from "../@types/QueryParams";
import { ReqBodyUpdateCategory } from "../@types/ReqBody";
import "dotenv/config";
import { getApiUrl } from "../utils/getApiUrl";

export class CategoryController {
  constructor() {}

  async getAll(req: Request<{}, {}, {}, BaseQueryParams>, res: Response) {
    const url = getApiUrl();

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

    return res.status(201).send({
      message: "category created sucessfully",
      category: categoryCreated
    });
  }

  async update(
    req: Request<{ id?: string }, {}, ReqBodyUpdateCategory, {}>,
    res: Response
  ) {
    const { id } = req.params;
    const { category } = req.body;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    if (!category || typeof category !== "string") {
      throw new ApiError("category is required and must be string", 400);
    }

    const categoryService = new CategoryService();

    const categoryUpdated = await categoryService.update(id, category);

    if (!category) {
      throw new ApiError("failed to update the category", 400);
    }

    return res.status(200).send({
      message: "category updated sucessfully",
      category: categoryUpdated
    });
  }

  async delete(req: Request<{ id?: string }, {}, {}, {}>, res: Response) {
    const { id } = req.params;

    if (!id) {
      throw new ApiError("id is required", 400);
    }

    const categoryService = new CategoryService();

    try {
      await categoryService.delete(id);
    } catch (error) {
      throw new ApiError("Failed to delete the category", 400);
    }

    return res.status(200).send({ message: "category deleted sucessfully" });
  }
}
