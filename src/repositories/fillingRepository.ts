import { Types } from "mongoose";
import { IFilling } from "../@types/Filling";
import { Filling } from "../models/Filling";

export class FillingRepository {
  constructor() {}

  async getAll(
    nameFilters: string[] = [],
    priceFilters: number[] = []
  ): Promise<IFilling[] | undefined> {
    const nameFilterObj =
      nameFilters.length > 0 ? { name: { $in: nameFilters } } : {};

    const priceFilterObj =
      priceFilters.length > 0 ? { price: { $in: priceFilters } } : {};

    const filters = {
      ...nameFilterObj,
      ...priceFilterObj
    };

    const fillingsRes = await Filling.find(filters);

    if (!fillingsRes) {
      return;
    }

    const fillings: IFilling[] = [];

    for (let i = 0; i < fillingsRes.length; i++) {
      const filling = fillingsRes[i];
      if (!filling) {
        return;
      }

      const { _id, name, price } = filling;
      fillings.push({ _id, name, price });
    }

    return fillings;
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
