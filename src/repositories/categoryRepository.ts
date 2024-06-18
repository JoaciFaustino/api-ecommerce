import { ICategory } from "../@types/Category";
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

  async create(category: string): Promise<ICategory | undefined> {
    const categoryCreated = await Category.create({ category: category });

    if (!categoryCreated) {
      return;
    }

    return { _id: categoryCreated._id, category: categoryCreated.category };
  }
}
