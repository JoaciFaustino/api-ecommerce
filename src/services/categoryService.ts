import { CategoryResponseDB } from "../@types/DBresponses";
import { CategoryRepository } from "../repositories/categoryRepository";
import { ApiError } from "../utils/ApiError";

export class CategoryService {
  constructor(private categoryRepository = new CategoryRepository()) {}

  async getAll(): Promise<string[] | undefined> {
    const categoryObjs: CategoryResponseDB[] | undefined =
      await this.categoryRepository.getAll();

    if (!categoryObjs) return;

    const categories: string[] = categoryObjs.map(
      (category) => category?.category as string
    );

    return categories;
  }

  async create(category: string): Promise<string | undefined> {
    const categoryObj: CategoryResponseDB =
      await this.categoryRepository.create(category);

    return categoryObj?.category;
  }
}
