import { FrostingResponseDB } from "../@types/DBresponses";
import { IFrosting } from "../@types/Frosting";
import { Frosting } from "../models/Frosting";

export class FrostingRepository {
  constructor() {}

  async getAll(): Promise<FrostingResponseDB[]> {
    return await Frosting.find();
  }

  async getOne(
    nameFilters: string[] = [],
    priceFilters: number[] = []
  ): Promise<IFrosting | undefined> {
    if (nameFilters.length === 0 && priceFilters.length === 0) {
      return;
    }

    const nameFiltersObj =
      nameFilters.length > 0 ? { name: { $in: nameFilters } } : {};

    const priceFiltersObj =
      priceFilters.length > 0 ? { price: { $in: priceFilters } } : {};

    const frostingRes: FrostingResponseDB = await Frosting.findOne({
      ...nameFiltersObj,
      ...priceFiltersObj
    });

    if (!frostingRes) return;

    const { _id, name, price } = frostingRes;

    return {
      _id,
      name,
      price
    };
  }

  async create(name: string, price: number): Promise<FrostingResponseDB> {
    return await Frosting.create<IFrosting>({ name: name, price: price });
  }
}
