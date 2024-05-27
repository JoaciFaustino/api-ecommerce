import { FillingResponseDB } from "../@types/DBresponses";
import { IFilling } from "../@types/Filling";
import { FillingRepository } from "../repositories/fillingRepository";

export class FillingService {
  constructor(private fillingRepository = new FillingRepository()) {}

  async getAll(): Promise<IFilling[] | undefined> {
    const fillingsRes: FillingResponseDB[] | undefined =
      await this.fillingRepository.getAll();

    if (!fillingsRes) return;

    const fillings: IFilling[] = fillingsRes.reduce(
      (newFillings: IFilling[], filling: FillingResponseDB) => {
        if (!filling) return [...newFillings];

        const { _id, name, price } = filling;

        return [...newFillings, { _id, name, price }];
      },
      [] as IFilling[]
    );

    return fillings;
  }

  async create(name: string, price: number): Promise<IFilling | undefined> {
    const fillingCreated: FillingResponseDB =
      await this.fillingRepository.create(name, price);

    if (!fillingCreated?.name || !fillingCreated?.price || !fillingCreated?._id)
      return;

    return {
      _id: fillingCreated._id,
      name: fillingCreated.name,
      price: fillingCreated.price
    };
  }
}
