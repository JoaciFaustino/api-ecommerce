import { CakeTypeResponseDB } from "../@types/DBresponses";
import { CakeTypeRepository } from "../repositories/cakeTypeRepository";

export class CakeTypeService {
  constructor(private cakeTypeRepository = new CakeTypeRepository()) {}

  async getAll(): Promise<string[] | undefined> {
    const cakeTypeObjs: CakeTypeResponseDB[] | undefined =
      await this.cakeTypeRepository.getAll();

    if (!cakeTypeObjs) return;

    const cakeTypes: string[] = cakeTypeObjs.map(
      (cakeTypeObjs) => cakeTypeObjs?.type as string
    );

    return cakeTypes;
  }

  async create(cakeType: string): Promise<string | undefined> {
    const cakeTypeObj = await this.cakeTypeRepository.create(cakeType);

    return cakeTypeObj?.type;
  }
}
