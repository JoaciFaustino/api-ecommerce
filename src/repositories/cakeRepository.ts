import { CakeResponseDB } from "../@types/DBresponses";
import { SortByCakes } from "../@types/cakes";
import { Cake } from "../models/Cake";

export class CakeRepository {
  constructor() {}

  async countDocs(): Promise<number> {
    return await Cake.countDocuments({});
  }

  async getAll(
    limit: number,
    page: number,
    sortBy: SortByCakes
  ): Promise<CakeResponseDB[]> {
    return await Cake.find()
      .limit(limit)
      .skip(limit * (page - 1))
      .sort(sortBy);
  }

  async findById(id: string): Promise<CakeResponseDB> {
    return await Cake.findById(id);
  }

  async create(
    type: string,
    pricing: number,
    imageUrl: string,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    return await Cake.create({
      type: type,
      pricing: pricing,
      imageUrl: imageUrl,
      frosting: frosting,
      filling: filling,
      size: size
    });
  }

  async update(
    id: string,
    type?: string,
    pricing?: number,
    imageUrl?: string,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    return await Cake.findByIdAndUpdate(
      { _id: id },
      {
        type: type,
        pricing: pricing,
        imageUrl: imageUrl,
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
