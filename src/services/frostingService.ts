import { FrostingResponseDB } from "../@types/DBresponses";
import { IFrosting } from "../@types/Frosting";
import { FrostingRepository } from "../repositories/frostingRepository";

export class FrostingService {
  constructor(private frostingRepository = new FrostingRepository()) {}

  async getAll(): Promise<IFrosting[]> {
    const frostingsResponse: FrostingResponseDB[] =
      await this.frostingRepository.getAll();

    const frostings: IFrosting[] = frostingsResponse.reduce(
      (newFrostings: IFrosting[], frosting: FrostingResponseDB | undefined) => {
        if (!frosting) return [...newFrostings];

        const { _id, name, price } = frosting;

        return [...newFrostings, { _id, name, price }];
      },
      []
    );

    return frostings;
  }

  async create(name: string, price: number): Promise<IFrosting | undefined> {
    const frostingCreated: FrostingResponseDB =
      await this.frostingRepository.create(name, price);

    if (
      !frostingCreated?._id ||
      !frostingCreated.name ||
      !frostingCreated.price
    ) {
      return;
    }

    return {
      _id: frostingCreated?._id,
      name: frostingCreated.name,
      price: frostingCreated.price
    };
  }
}
