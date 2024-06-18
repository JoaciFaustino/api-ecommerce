import { ICakeType } from "../@types/CakeType";
import { CakeTypeRepository } from "../repositories/cakeTypeRepository";
import { ApiError } from "../utils/ApiError";

export class CakeTypeService {
  constructor(private cakeTypeRepository = new CakeTypeRepository()) {}

  async getAll(): Promise<ICakeType[] | undefined> {
    return await this.cakeTypeRepository.getAll();
  }

  async getOne(typeNameFilters: string[]): Promise<ICakeType | undefined> {
    return await this.cakeTypeRepository.getOne(typeNameFilters);
  }

  async create(cakeType: string): Promise<string | undefined> {
    const cakeTypeObj = await this.cakeTypeRepository.create(cakeType);

    return cakeTypeObj?.type;
  }

  async validateCakeTypeInCake(cakeType: string): Promise<ICakeType> {
    const typeInDB = await this.getOne([cakeType]);

    if (typeInDB?.type !== cakeType) {
      throw new ApiError(
        "this cake type isn't registered in the database",
        400
      );
    }

    return typeInDB;
  }
}
