import { CakeResponseDB } from "../@types/DBresponses";
import { SortByCakes } from "../@types/cakes";
import { CakeRepository } from "../repositories/cakeRepository";
import { ApiError } from "../utils/ApiError";
import { FilesService } from "./filesService";

export class CakeService {
  constructor(private cakeRepository = new CakeRepository()) {}

  async getAll(
    limit: number,
    page: number,
    sortBy: string
  ): Promise<{ cakes: CakeResponseDB[]; maxPages: number }> {
    const countDocuments: number = await this.cakeRepository.countDocs();
    const maxPages: number = Math.ceil(countDocuments / limit);

    if (maxPages < page)
      throw new ApiError("the page requested isn't exists", 404);

    let sortByObj: SortByCakes = null;

    switch (sortBy) {
      case "latest":
        sortByObj = { created_at: "descending" };
        break;

      case "price_high_to_low":
        sortByObj = { pricing: "descending" };
        break;

      case "price_low_to_high":
        sortByObj = { pricing: "ascending" };
        break;

      case "popularity":
        sortByObj = { bougths: "descending" };
        break;
    }

    if (!sortByObj) throw new ApiError("the page requested isn't exists", 404);

    const cakes: CakeResponseDB[] = await this.cakeRepository.getAll(
      limit,
      page,
      sortByObj
    );

    return { cakes: cakes, maxPages: maxPages };
  }

  async findById(id: string): Promise<CakeResponseDB> {
    return await this.cakeRepository.findById(id);
  }

  async create(
    hostUrl: string,
    type: string,
    pricing: number,
    imageCake: Express.Multer.File,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    const filesService = new FilesService();

    const imageUrl = await filesService.upload(imageCake, hostUrl);

    if (!imageUrl) throw new ApiError("failed to upload image", 500);

    return await this.cakeRepository.create(
      type,
      pricing,
      imageUrl,
      frosting,
      filling,
      size
    );
  }

  async update(
    id: string,
    type?: string,
    pricing?: number,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    return await this.cakeRepository.update(
      id,
      type,
      pricing,
      frosting,
      filling,
      size
    );
  }

  async delete(id: string): Promise<void> {
    await this.cakeRepository.delete(id);
  }
}
