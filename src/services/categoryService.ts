import { ICategory } from "../@types/Category";
import { CategoryResponseDB } from "../@types/DBresponses";
import { CategoryRepository } from "../repositories/categoryRepository";
import { ApiError } from "../utils/ApiError";

export class CategoryService {
  constructor(private categoryRepository = new CategoryRepository()) {}

  async getAll(
    categoryFilters: string[] = []
  ): Promise<ICategory[] | undefined> {
    return await this.categoryRepository.getAll(categoryFilters);
  }

  async create(category: string): Promise<string | undefined> {
    const categoryObj: CategoryResponseDB =
      await this.categoryRepository.create(category);

    return categoryObj?.category;
  }

  async validateAllCategoriesInCake(
    categories: string[]
  ): Promise<ICategory[]> {
    if (categories.length === 0) {
      return [];
    }

    const categoriesInDB = await this.getAll(categories);

    if (!categoriesInDB) {
      throw new ApiError("failed to find categories in database", 500);
    }

    const categoriesInDBStrings = categoriesInDB.map(
      (categoryInDb) => categoryInDb.category
    );

    for (let i = 0; i < categories.length; i++) {
      if (!categoriesInDBStrings.includes(categories[i])) {
        throw new ApiError(
          `the category '${categories[i]}' isn't registered in the database`,
          400
        );
      }
    }

    return categoriesInDB;
  }
}
