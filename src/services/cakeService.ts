import { CakeResponseDB } from "../@types/DBresponses";
import { CakeRepository } from "../repositories/cakeRepository";

export class CakeService {
  constructor(private cakeRepository = new CakeRepository()) {}

  async create(
    type: string,
    pricing: number,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    return await this.cakeRepository.create(
      type,
      pricing,
      frosting,
      filling,
      size
    );
  }
}
