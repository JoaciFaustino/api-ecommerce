import { ICakeType } from "../@types/CakeType";
import { CakeTypeResponseDB } from "../@types/DBresponses";
import { CakeType } from "../models/CakeType";

export class CakeTypeRepository {
  constructor() {}

  async getAll(): Promise<CakeTypeResponseDB[]> {
    return await CakeType.find();
  }

  async create(type: string): Promise<CakeTypeResponseDB> {
    return await CakeType.create<ICakeType>({ type: type });
  }
}
