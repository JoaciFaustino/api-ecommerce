import { IFrosting } from "../@types/Frosting";
import { Frosting } from "../models/Frosting";

export class FrostingRepository {
  constructor() {}

  async getAll(): Promise<IFrosting[] | undefined> {
    const frostingsRes = await Frosting.find();

    if (!frostingsRes) {
      return;
    }

    const frostings: IFrosting[] = frostingsRes.map((frosting) => {
      return { _id: frosting._id, name: frosting.name, price: frosting.price };
    });

    return frostings;
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

    const frostingRes = await Frosting.findOne({
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

  async create(name: string, price: number): Promise<IFrosting | undefined> {
    const frosting = await Frosting.create<IFrosting>({
      name: name,
      price: price
    });

    if (!frosting) {
      return;
    }

    return { _id: frosting._id, name: frosting.name, price: frosting.price };
  }
}
