import { CakeResponseDB } from "../@types/DBresponses";
import { Cake } from "../models/Cake";

export class CakeRepository {
  constructor() {}

  async create(
    type: string,
    pricing: number,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    return await Cake.create({
      type: type,
      pricing: pricing,
      frosting: frosting,
      filling: filling,
      size: size
    });
  }

  async update(
    id: string,
    type?: string,
    pricing?: number,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    return await Cake.findByIdAndUpdate(
      { _id: id },
      {
        type: type,
        pricing: pricing,
        frosting: frosting,
        filling: filling,
        size: size
      },
      { new: true }
    );
  }

  async delete(id: string): Promise<void> {
    await Cake.findByIdAndDelete({ _id: id });
  }
}
