import { IFilling } from "../@types/Filling";
import { BaseQueryParams } from "../@types/QueryParams";
import { FillingRepository } from "../repositories/fillingRepository";
import { ApiError } from "../utils/ApiError";
import { getPrevAndNextUrl, normalizeQueryString } from "../utils/queryString";

type GetAllReturn = {
  fillings?: IFilling[];
  maxPages: number;
  prevUrl: string | null;
  nextUrl: string | null;
};

export class FillingService {
  constructor(private fillingRepository = new FillingRepository()) {}

  async getAll(
    url: string,
    { limit = "20", page = "1", search = [] }: BaseQueryParams
  ): Promise<GetAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;
    const searchByName: string | undefined = normalizeQueryString(search);

    const quantityFillingsOnDb = await this.fillingRepository.countDocs(
      searchByName ? [searchByName] : []
    );

    const maxPages =
      quantityFillingsOnDb > 0
        ? Math.ceil(quantityFillingsOnDb / limitNumber)
        : 1;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const fillings = await this.fillingRepository.getAll(
      limitNumber,
      pageNumber,
      searchByName ? [searchByName] : []
    );

    const { nextUrl, prevUrl } = getPrevAndNextUrl(url, pageNumber, maxPages);

    return { fillings, maxPages, nextUrl, prevUrl };
  }

  async getById(id: string): Promise<IFilling | undefined> {
    const filling: IFilling | undefined = await this.fillingRepository.getById(
      id
    );

    if (!filling) {
      return;
    }

    return filling;
  }

  async create(name: string, price: number): Promise<IFilling | undefined> {
    return await this.fillingRepository.create(name, price);
  }

  async update(
    id: string,
    name?: string,
    price?: number
  ): Promise<IFilling | undefined> {
    return await this.fillingRepository.update(id, name, price);
  }

  async delete(id: string): Promise<void> {
    await this.fillingRepository.delete(id);
  }

  async validateAllFillingsInCake(fillingNames: string[]): Promise<IFilling[]> {
    if (fillingNames.length === 0) {
      return [];
    }

    const limit = 9999;
    const page = 1;

    const fillingsInDB: IFilling[] | undefined =
      await this.fillingRepository.getAll(limit, page, fillingNames);

    if (!fillingsInDB) {
      throw new ApiError("failed to find fillings in database", 500);
    }

    const fillingsWithCorrectLayers: IFilling[] = fillingNames.reduce(
      (fillingsWithCorrectLayers: IFilling[], fillingName) => {
        const filling: IFilling | undefined = fillingsInDB.find(
          (fillingInDb) => fillingInDb.name === fillingName
        );

        return filling
          ? [...fillingsWithCorrectLayers, filling]
          : [...fillingsWithCorrectLayers];
      },
      []
    );

    if (fillingsWithCorrectLayers.length !== fillingNames.length) {
      throw new ApiError(
        "some fillings aren't registered in the database",
        400
      );
    }

    return fillingsWithCorrectLayers;
  }
}
