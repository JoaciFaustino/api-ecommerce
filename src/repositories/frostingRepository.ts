import { FrostingResponseDB } from "../@types/DBresponses";
import { IFrosting } from "../@types/Frosting";
import { Frosting } from "../models/Frosting";

export class FrostingRepository {
  constructor() {}

  async getAll(): Promise<FrostingResponseDB[]> {
    return await Frosting.find();
  }

  async create(name: string, price: number): Promise<FrostingResponseDB> {
    return await Frosting.create<IFrosting>({ name: name, price: price });
  }
}
