import { IFrosting } from "../@types/Frosting";
import { FrostingRepository } from "../repositories/frostingRepository";
import { ApiError } from "../utils/ApiError";

export class FrostingService {
  constructor(private frostingRepository = new FrostingRepository()) {}

  async getAll(): Promise<IFrosting[] | undefined> {
    const frostingsResponse: IFrosting[] | undefined =
      await this.frostingRepository.getAll();

    return frostingsResponse;
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
