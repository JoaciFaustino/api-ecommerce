import { ICategory } from "../@types/Category";
import { CategoryResponseDB } from "../@types/DBresponses";
import { Category } from "../models/Category";

export class CategoryRepository {
  constructor() {}

  async getAll(): Promise<CategoryResponseDB[]> {
    return await Category.find();
  }

  async create(category: string): Promise<CategoryResponseDB> {
    return await Category.create<ICategory>({ category: category });
  }
}
