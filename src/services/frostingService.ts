import { FrostingResponseDB } from "../@types/DBresponses";
import { IFrosting } from "../@types/Frosting";
import { FrostingRepository } from "../repositories/frostingRepository";
import { ApiError } from "../utils/ApiError";

export class FrostingService {
  constructor(private frostingRepository = new FrostingRepository()) {}

  async getAll(): Promise<IFrosting[]> {
    const frostingsResponse: FrostingResponseDB[] =
      await this.frostingRepository.getAll();

    const frostings: IFrosting[] = frostingsResponse.reduce(
      (newFrostings: IFrosting[], frosting: FrostingResponseDB | undefined) => {
        if (!frosting) return [...newFrostings];

        const { _id, name, price } = frosting;

        return [...newFrostings, { _id, name, price }];
      },
      []
    );

    return frostings;
  }

  async getOne(
    nameFilters: string[] = [],
    priceFilters: number[] = []
  ): Promise<IFrosting | undefined> {
    return await this.frostingRepository.getOne(nameFilters, priceFilters);
  }

  async create(name: string, price: number): Promise<IFrosting | undefined> {
    const frostingCreated: FrostingResponseDB =
      await this.frostingRepository.create(name, price);

    if (!frostingCreated || !frostingCreated.name || !frostingCreated.price) {
      return;
    }

    return {
      _id: frostingCreated?._id,
      name: frostingCreated.name,
      price: frostingCreated.price
    };
  }

  async validateFrostingInCake(
    frostingName?: string
  ): Promise<IFrosting | undefined> {
    if (!frostingName) return undefined;

    const frostingInDB: IFrosting | undefined = await this.getOne([
      frostingName
    ]);

    if (frostingInDB?.name !== frostingName) {
      throw new ApiError("this frosting isn't registered in the database", 400);
    }

    return frostingInDB;
  }
}
