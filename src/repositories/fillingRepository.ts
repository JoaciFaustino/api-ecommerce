import { FilterQuery, Types } from "mongoose";
import { IFilling } from "../@types/Filling";
import { Filling } from "../models/Filling";

export class FillingRepository {
  constructor() {}

  async countDocs(nameFilters: string[] = []): Promise<number> {
    const query: FilterQuery<IFilling> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              name: { $regex: name, $options: "i" }
            }))
          }
        : {};

    return Filling.countDocuments(query);
  }

  async getAll(
    limit: number,
    page: number,
    nameFilters: string[] = []
  ): Promise<IFilling[] | undefined> {
    const query: FilterQuery<IFilling> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              name: { $regex: name, $options: "i" }
            }))
          }
        : {};

    const fillings = await Filling.find(query)
      .skip(limit * (page - 1))
      .limit(limit);

    if (!fillings) {
      return;
    }

    return fillings.map(({ _id, name, price }) => ({ _id, name, price }));
  }

  async getById(id: string | Types.ObjectId): Promise<IFilling | undefined> {
    const filling = await Filling.findById(id);

    if (!filling) {
      return;
    }

    return { _id: filling._id, name: filling.name, price: filling.price };
  }

  async create(name: string, price: number): Promise<IFilling | undefined> {
    const filling = await Filling.create({
      name: name,
      price: price
    });

    if (!filling) {
      return;
    }

    return { _id: filling._id, name: filling.name, price: filling.price };
  }
}
