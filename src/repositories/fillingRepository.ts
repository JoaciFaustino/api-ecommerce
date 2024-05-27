import { FillingResponseDB } from "../@types/DBresponses";
import { IFilling } from "../@types/Filling";
import { Filling } from "../models/Filling";

export class FillingRepository {
  constructor() {}

  async getAll(): Promise<FillingResponseDB[]> {
    return await Filling.find();
  }

  async create(name: string, price: number): Promise<FillingResponseDB> {
    return await Filling.create<IFilling>({ name: name, price: price });
  }
}
