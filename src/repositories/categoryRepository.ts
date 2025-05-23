import { FilterQuery } from "mongoose";
import { ICategory } from "../@types/Category";
import { Category } from "../models/Category";

export class CategoryRepository {
  constructor() {}

  async countDocs(nameFilters: string[] = []): Promise<number> {
    const query: FilterQuery<ICategory> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              category: { $regex: name, $options: "i" }
            }))
          }
        : {};

    return await Category.countDocuments(query);
  }

  async getAll(
    limit: number,
    page: number,
    nameFilters: string[] = []
  ): Promise<ICategory[] | undefined> {
    const query: FilterQuery<ICategory> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              category: { $regex: name, $options: "i" }
            }))
          }
        : {};

    const categories = await Category.find(query)
      .sort({ category: 1 })
      .skip(limit * (page - 1))
      .limit(limit);

    if (!categories) {
      return;
    }

    return categories.map(({ _id, category }) => ({ _id, category }));
  }

  async create(category: string): Promise<ICategory | undefined> {
    const categoryCreated = await Category.create({ category: category });

    if (!categoryCreated) {
      return;
    }

    return { _id: categoryCreated._id, category: categoryCreated.category };
  }

  async update(id: string, category: string): Promise<ICategory | undefined> {
    const categoryUpdated = await Category.findByIdAndUpdate(
      id,
      { category },
      { new: true }
    );

    if (!categoryUpdated) {
      return;
    }

    return { _id: categoryUpdated._id, category: categoryUpdated.category };
  }

  async delete(id: string): Promise<void> {
    await Category.findByIdAndDelete(id);
  }
}
