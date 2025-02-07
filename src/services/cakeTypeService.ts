import { ICakeType } from "../@types/CakeType";
import { BaseQueryParams } from "../@types/QueryParams";
import { CakeTypeRepository } from "../repositories/cakeTypeRepository";
import { ApiError } from "../utils/ApiError";
import { getPrevAndNextUrl, normalizeQueryString } from "../utils/queryString";

type GetAllReturn = {
  maxPages: number;
  cakeTypes?: ICakeType[];
  prevUrl: string | null;
  nextUrl: string | null;
};

export class CakeTypeService {
  constructor(private cakeTypeRepository = new CakeTypeRepository()) {}

  async getAll(
    url: string,
    { limit = "20", page = "1", search = [] }: BaseQueryParams
  ): Promise<GetAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;
    const searchByName: string | undefined = normalizeQueryString(search);

    const quantityCakeTypesOnDb = await this.cakeTypeRepository.countDocs(
      searchByName ? [searchByName] : []
    );
    const maxPages =
      quantityCakeTypesOnDb > 0
        ? Math.ceil(quantityCakeTypesOnDb / limitNumber)
        : 1;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const cakeTypes = await this.cakeTypeRepository.getAll(
      limitNumber,
      pageNumber,
      searchByName ? [searchByName] : []
    );

    const { nextUrl, prevUrl } = getPrevAndNextUrl(url, pageNumber, maxPages);

    return { cakeTypes, maxPages, nextUrl, prevUrl };
  }

  async getOne(typeNameFilters: string[]): Promise<ICakeType | undefined> {
    return await this.cakeTypeRepository.getOne(typeNameFilters);
  }

  async create(cakeType: string): Promise<string | undefined> {
    const cakeTypeObj = await this.cakeTypeRepository.create(cakeType);

    return cakeTypeObj?.type;
  }

  async validateCakeTypeInCake(cakeType: string): Promise<ICakeType> {
    const typeInDB = await this.getOne([cakeType]);

    if (typeInDB?.type !== cakeType) {
      throw new ApiError(
        "this cake type isn't registered in the database",
        400
      );
    }

    return typeInDB;
  }

  async update(id: string, cakeType: string): Promise<ICakeType | undefined> {
    return await this.cakeTypeRepository.update(id, cakeType);
  }
}
