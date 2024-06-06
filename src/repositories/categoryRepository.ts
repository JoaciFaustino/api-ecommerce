import { ICategory } from "../@types/Category";
import { CategoryResponseDB } from "../@types/DBresponses";
import { Category } from "../models/Category";

export class CategoryRepository {
  constructor() {}

  async getAll(
    categoryFilters: string[] = []
  ): Promise<ICategory[] | undefined> {
    const filters =
      categoryFilters.length > 0 ? { category: { $in: categoryFilters } } : {};

    const categoryObjs = await Category.find(filters);

    if (!categoryObjs) return;

    const categories: ICategory[] = [];

    for (let i = 0; i < categoryObjs.length; i++) {
      const { _id, category } = categoryObjs[i];

      categories.push({ _id, category });
    }

    return categories;
  }

  async create(category: string): Promise<CategoryResponseDB> {
    return await Category.create<ICategory>({ category: category });
  }
}
