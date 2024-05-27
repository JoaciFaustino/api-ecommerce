import { Request, Response } from "express";
import { CategoryService } from "../services/categoryService";
import { CategoryResponseDB } from "../@types/DBresponses";
import { ApiError } from "../utils/ApiError";

export class CategoryController {
  constructor() {}

  async getAll(req: Request, res: Response) {
    const categoryService = new CategoryService();
    const categories: string[] | undefined = await categoryService.getAll();

    if (!categories) throw new ApiError("failed to get the categories", 500);

    res.status(200).send({ categories });
  }

  async create(req: Request, res: Response) {
    const { category } = req.body;

    if (!category) throw new ApiError("category is required", 400);

    const categoryService = new CategoryService();
    const categoryCreated = await categoryService.create(category);

    if (!categoryCreated)
      throw new ApiError("failed to create the category", 500);

    res.status(200).send({
      message: "category created sucessfully",
      category: categoryCreated
    });
  }
}
