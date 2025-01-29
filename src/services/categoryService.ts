import { ICategory } from "../@types/Category";
import { BaseQueryParams } from "../@types/QueryParams";
import { CategoryRepository } from "../repositories/categoryRepository";
import { ApiError } from "../utils/ApiError";
import { getPrevAndNextUrl, normalizeQueryString } from "../utils/queryString";

type GetAllReturn = {
  maxPages: number;
  categories?: ICategory[];
  prevUrl: string | null;
  nextUrl: string | null;
};

export class CategoryService {
  constructor(private categoryRepository = new CategoryRepository()) {}

  async getAll(
    url: string,
    { limit = "20", page = "1", search = [] }: BaseQueryParams
  ): Promise<GetAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;
    const searchByName: string | undefined = normalizeQueryString(search);

    const quantityCategoriesOnDb = await this.categoryRepository.countDocs(
      searchByName ? [searchByName] : []
    );

    const maxPages =
      quantityCategoriesOnDb > 0
        ? Math.ceil(quantityCategoriesOnDb / limitNumber)
        : 1;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const categories = await this.categoryRepository.getAll(
      limitNumber,
      pageNumber,
      searchByName ? [searchByName] : []
    );

    const { nextUrl, prevUrl } = getPrevAndNextUrl(url, pageNumber, maxPages);

    return { categories, maxPages, nextUrl, prevUrl };
  }

  async create(category: string): Promise<ICategory | undefined> {
    return await this.categoryRepository.create(category);
  }

  async validateAllCategoriesInCake(
    categories: string[]
  ): Promise<ICategory[]> {
    if (categories.length === 0) {
      return [];
    }

    const limit = 9999;
    const page = 1;

    const categoriesInDB = await this.categoryRepository.getAll(
      limit,
      page,
      categories
    );

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

    return categoriesInDB.filter((category) =>
      categories.includes(category.category)
    );
  }
}
