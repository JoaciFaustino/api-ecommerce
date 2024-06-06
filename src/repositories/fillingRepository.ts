import { Types } from "mongoose";
import { FillingResponseDB } from "../@types/DBresponses";
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

    const fillingsRes: FillingResponseDB[] = await Filling.find(filters);

    if (!fillingsRes) return;

    const fillings: IFilling[] = [];

    for (let i = 0; i < fillingsRes.length; i++) {
      const filling = fillingsRes[i];
      if (!filling) return;

      const { _id, name, price } = filling;
      fillings.push({ _id, name, price });
    }

    return fillings;
  }

  async getById(id: string | Types.ObjectId): Promise<FillingResponseDB> {
    return await Filling.findById(id);
  }

  async create(name: string, price: number): Promise<FillingResponseDB> {
    return await Filling.create<IFilling>({ name: name, price: price });
  }
}
