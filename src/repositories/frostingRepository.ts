import { FilterQuery } from "mongoose";
import { IFrosting } from "../@types/Frosting";
import { Frosting } from "../models/Frosting";

export class FrostingRepository {
  constructor() {}

  async countDocs(nameFilters: string[] = []): Promise<number> {
    const query: FilterQuery<IFrosting> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              name: { $regex: name, $options: "i" }
            }))
          }
        : {};

    return Frosting.countDocuments(query);
  }

  async getAll(
    limit: number,
    page: number,
    nameFilters: string[] = []
  ): Promise<IFrosting[] | undefined> {
    const query: FilterQuery<IFrosting> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              name: { $regex: name, $options: "i" }
            }))
          }
        : {};

    const frostings = await Frosting.find(query)
      .skip(limit * (page - 1))
      .limit(limit);

    if (!frostings) {
      return;
    }

    return frostings.map(({ _id, name, price }) => ({ _id, name, price }));
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
