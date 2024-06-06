import { ICakeType } from "../@types/CakeType";
import { CakeTypeResponseDB } from "../@types/DBresponses";
import { CakeType } from "../models/CakeType";
import { ApiError } from "../utils/ApiError";

export class CakeTypeRepository {
  constructor() {}

  async getAll(): Promise<ICakeType[] | undefined> {
    return await CakeType.find();
  }

  async getOne(typeNameFilters: string[]): Promise<ICakeType | undefined> {
    const filter =
      typeNameFilters.length > 0 ? { type: { $in: typeNameFilters } } : {};

    const cakeTypeRes = await CakeType.findOne(filter);

    if (!cakeTypeRes) return;

    const { _id, type } = cakeTypeRes;

    return { _id, type };
  }

  async create(type: string): Promise<ICakeType | undefined> {
    const cakeTypeRes: CakeTypeResponseDB = await CakeType.create<ICakeType>({
      type: type
    });

    if (!cakeTypeRes) return;

    return { _id: cakeTypeRes._id, type: cakeTypeRes.type };
  }
}
