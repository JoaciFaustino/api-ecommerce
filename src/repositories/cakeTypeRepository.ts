import { ICakeType } from "../@types/CakeType";
import { CakeType } from "../models/CakeType";

export class CakeTypeRepository {
  constructor() {}

  async getAll(): Promise<ICakeType[] | undefined> {
    const cakeTypes = await CakeType.find();

    if (!cakeTypes) {
      return;
    }

    return cakeTypes.map((cakeType) => {
      return { _id: cakeType._id, type: cakeType.type };
    });
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
}
