import { FilterQuery } from "mongoose";
import { ICakeType } from "../@types/CakeType";
import { CakeType } from "../models/CakeType";

export class CakeTypeRepository {
  constructor() {}

  async countDocs(nameFilters: string[] = []): Promise<number> {
    const query: FilterQuery<ICakeType> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              type: { $regex: name, $options: "i" }
            }))
          }
        : {};

    return await CakeType.countDocuments(query);
  }

  async getAll(
    limit: number,
    page: number,
    nameFilters: string[] = []
  ): Promise<ICakeType[] | undefined> {
    const query: FilterQuery<ICakeType> =
      nameFilters.length > 0
        ? {
            $or: nameFilters.map((name) => ({
              type: { $regex: name, $options: "i" }
            }))
          }
        : {};

    const cakeTypes = await CakeType.find(query)
      .skip(limit * (page - 1))
      .limit(limit);

    if (!cakeTypes) {
      return;
    }

    return cakeTypes.map(({ _id, type }) => ({ _id, type }));
  }

  async getOne(typeNameFilters: string[]): Promise<ICakeType | undefined> {
    const filter =
      typeNameFilters.length > 0 ? { type: { $in: typeNameFilters } } : {};

    const cakeTypeRes = await CakeType.findOne(filter);

    if (!cakeTypeRes) {
      return;
    }

    const { _id, type } = cakeTypeRes;

    return { _id, type };
  }

  async create(type: string): Promise<ICakeType | undefined> {
    const cakeTypeRes = await CakeType.create({
      type: type
    });

    if (!cakeTypeRes) {
      return;
    }

    return { _id: cakeTypeRes._id, type: cakeTypeRes.type };
  }

  async update(id: string, type: string): Promise<ICakeType | undefined> {
    const cakeType = await CakeType.findByIdAndUpdate(
      id,
      { type },
      { new: true }
    );

    if (!cakeType) {
      return;
    }

    return { _id: cakeType._id, type: cakeType.type };
  }

  async delete(id: string): Promise<void> {
    await CakeType.findByIdAndDelete(id);
  }
}
