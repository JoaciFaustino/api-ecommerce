import { IFrosting } from "../@types/Frosting";
import { BaseQueryParams } from "../@types/QueryParams";
import { FrostingRepository } from "../repositories/frostingRepository";
import { ApiError } from "../utils/ApiError";
import { getPrevAndNextUrl, normalizeQueryString } from "../utils/queryString";

type GetAllReturn = {
  maxPages: number;
  frostings?: IFrosting[];
  prevUrl: string | null;
  nextUrl: string | null;
};

export class FrostingService {
  constructor(private frostingRepository = new FrostingRepository()) {}

  async getAll(
    url: string,
    { limit = "20", page = "1", search = [] }: BaseQueryParams
  ): Promise<GetAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;
    const searchByName: string | undefined = normalizeQueryString(search);

    const quantityFrostingOnDb = await this.frostingRepository.countDocs(
      searchByName ? [searchByName] : []
    );

    const maxPages =
      quantityFrostingOnDb > 0
        ? Math.ceil(quantityFrostingOnDb / limitNumber)
        : 1;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const frostings = await this.frostingRepository.getAll(
      limitNumber,
      pageNumber,
      searchByName ? [searchByName] : []
    );

    const { nextUrl, prevUrl } = getPrevAndNextUrl(url, pageNumber, maxPages);

    return { frostings, maxPages, nextUrl, prevUrl };
  }

  async getOne(
    nameFilters: string[] = [],
    priceFilters: number[] = []
  ): Promise<IFrosting | undefined> {
    return await this.frostingRepository.getOne(nameFilters, priceFilters);
  }

  async create(name: string, price: number): Promise<IFrosting | undefined> {
    const frostingCreated: IFrosting | undefined =
      await this.frostingRepository.create(name, price);

    return frostingCreated;
  }

  async validateFrostingInCake(
    frostingName?: string
  ): Promise<IFrosting | undefined> {
    if (!frostingName) {
      return;
    }

    const frostingInDB: IFrosting | undefined = await this.getOne([
      frostingName
    ]);

    if (frostingInDB?.name !== frostingName) {
      throw new ApiError("this frosting isn't registered in the database", 400);
    }

    return frostingInDB;
  }
}
