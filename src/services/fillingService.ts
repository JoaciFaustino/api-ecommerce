import { FillingResponseDB } from "../@types/DBresponses";
import { IFilling } from "../@types/Filling";
import { FillingRepository } from "../repositories/fillingRepository";
import { ApiError } from "../utils/ApiError";

export class FillingService {
  constructor(private fillingRepository = new FillingRepository()) {}

  async getAll(
    nameFilters: string[] = [],
    priceFilters: number[] = []
  ): Promise<IFilling[] | undefined> {
    return await this.fillingRepository.getAll(nameFilters, priceFilters);
  }

  async getById(id: string): Promise<IFilling | undefined> {
    const filling: FillingResponseDB = await this.fillingRepository.getById(id);

    if (!filling) return;

    const { _id, name, price } = filling;

    return { _id, name, price };
  }

  async create(name: string, price: number): Promise<IFilling | undefined> {
    const fillingCreated: FillingResponseDB =
      await this.fillingRepository.create(name, price);

    if (!fillingCreated) return;

    return {
      _id: fillingCreated._id,
      name: fillingCreated.name,
      price: fillingCreated.price
    };
  }

  async allFillingsInCakeIsValid(fillings: IFilling[]): Promise<boolean> {
    const fillingsNames = fillings.reduce(
      (names: string[], filling) => [...names, filling.name],
      []
    );

    const fillingsRes: IFilling[] | undefined =
      await this.fillingRepository.getAll(fillingsNames);

    if (!fillingsRes || fillingsRes.length !== fillings.length) {
      return false;
    }

    const allCategoriesExist = fillings.every((filling) =>
      fillingsRes.includes(filling)
    );

    return true;
  }

  async validateAllFillingsInCake(fillingNames: string[]): Promise<IFilling[]> {
    if (fillingNames.length === 0) return [];

    const fillingsInDB: IFilling[] | undefined = await this.getAll(
      fillingNames
    );

    if (!fillingsInDB) {
      throw new ApiError("failed to find fillings in database", 500);
    }

    const fillingsInDbNames: string[] = fillingsInDB.map(
      (fillingInDb) => fillingInDb.name
    );

    for (let i = 0; i < fillingNames.length; i++) {
      if (!fillingsInDbNames.includes(fillingNames[i])) {
        throw new ApiError(
          `the filling '${fillingNames[i]}' isn't registered in the database`,
          400
        );
      }
    }

    return fillingsInDB;
  }
}
