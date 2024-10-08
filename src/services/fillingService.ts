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
    const fillingCreated: IFilling | undefined =
      await this.fillingRepository.create(name, price);

    if (!fillingCreated) return;

    return fillingCreated;
  }

  async validateAllFillingsInCake(fillingNames: string[]): Promise<IFilling[]> {
    if (fillingNames.length === 0) {
      return [];
    }

    const limit = fillingNames.length;
    const page = 1;

    const fillingsInDB: IFilling[] | undefined =
      await this.fillingRepository.getAll(limit, page, fillingNames);

    if (!fillingsInDB) {
      throw new ApiError("failed to find fillings in database", 500);
    }

    const fillingsInDbNames: string[] = fillingsInDB.map(
      (fillingInDb) => fillingInDb.name
    );

    const someFillingInvalid: string[] = fillingNames.filter(
      (fillingName) => !fillingsInDbNames.includes(fillingName)
    );

    if (someFillingInvalid.length > 0) {
      throw new ApiError(
        `the filling '${fillingNames[0]}' isn't registered in the database`,
        400
      );
    }

    return fillingsInDB;
  }

  //IT IS NOT USED IN NOTHING IN THE CODE, BUT MAYBE IT CAN BE USED

  // async allFillingsInCakeIsValid(fillings: IFilling[]): Promise<boolean> {
  //   const fillingsNames = fillings.reduce(
  //     (names: string[], filling: IFilling) => [...names, filling.name],
  //     []
  //   );

  //   const fillingsRes: IFilling[] | undefined =
  //     await this.fillingRepository.getAll(fillingsNames);

  //   if (!fillingsRes) {
  //     return false;
  //   }

  //   const allFillingsExist = fillingsRes.every((filling) =>
  //     fillingsNames.includes(filling.name)
  //   );

  //   if (!allFillingsExist) {
  //     return false;
  //   }

  //   return true;
  // }
}
