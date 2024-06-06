import { CakeResponseDB } from "../@types/DBresponses";
import { CakeRepository } from "../repositories/cakeRepository";
import { ApiError } from "../utils/ApiError";
import { FilesService } from "./filesService";
import { SORT_BY_OPTIONS, TypeKeysSortBy } from "../@types/SortBy";
import { IFrosting } from "../@types/Frosting";
import { IFilling } from "../@types/Filling";
import {
  ICake,
  PricePerSize,
  SIZES_POSSIBLES_ENUM,
  Size
} from "../@types/Cake";
import { FillingService } from "./fillingService";
import { MAX_LAYER_OF_FILLINGS } from "../utils/constants";
import { CategoryService } from "./categoryService";
import { CakeTypeService } from "./cakeTypeService";
import { FrostingService } from "./frostingService";
import { IQueryParamsGetAll } from "../@types/QueryParams";
import { ReqBodyCreateCake } from "../@types/ReqBody";

export class CakeService {
  constructor(
    private cakeRepository = new CakeRepository(),
    private fillingService = new FillingService(),
    private categoryService = new CategoryService(),
    private cakeTypeService = new CakeTypeService(),
    private frostingService = new FrostingService(),
    private filesService = new FilesService()
  ) {}

  async getAll({
    limit = "20",
    page = "1",
    sortBy = "popularity",
    categoryId = [],
    fillingId = [],
    frostingId = [],
    typeId = [],
    size = []
  }: IQueryParamsGetAll): Promise<{
    cakes: ICake[] | undefined;
    maxPages: number;
  }> {
    const limitLastValue: string =
      typeof limit === "string" ? limit : limit[limit.length - 1];
    const limitNumber = parseInt(limitLastValue) || 20;

    const pageLastValue: string =
      typeof page === "string" ? page : page[page.length - 1];
    const pageNumber = parseInt(pageLastValue) || 1;

    const sortByLastValue =
      typeof sortBy === "string" ? sortBy : sortBy[sortBy.length - 1];

    const newSortBy = SORT_BY_OPTIONS.includes(
      sortByLastValue as TypeKeysSortBy
    )
      ? (sortBy as TypeKeysSortBy)
      : "popularity";

    const typeFilters = Array.isArray(typeId) ? typeId : [typeId];
    const categoryFilters = Array.isArray(categoryId)
      ? categoryId
      : [categoryId];
    const fillingFilters = Array.isArray(fillingId) ? fillingId : [fillingId];
    const frostingFilters = Array.isArray(frostingId)
      ? frostingId
      : [frostingId];

    const sizeFilters = Array.isArray(size) ? size : [size];
    const sizeFiltersValids = sizeFilters.filter((size) =>
      SIZES_POSSIBLES_ENUM.includes(size as Size)
    );

    const cakes = await this.cakeRepository.getAll(
      limitNumber,
      pageNumber,
      newSortBy,
      categoryFilters,
      fillingFilters,
      frostingFilters,
      typeFilters,
      sizeFiltersValids
    );

    if (!cakes) return { cakes: undefined, maxPages: 0 };

    const maxPages: number =
      cakes.length > 0 ? Math.ceil((cakes.length - 1) / limitNumber) : 0;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    return { cakes, maxPages };
  }

  async findById(id: string): Promise<CakeResponseDB> {
    return await this.cakeRepository.findById(id);
  }

  async create(
    hostUrl: string,
    {
      name,
      type,
      size,
      pricePerSize,
      frosting,
      categories = [],
      sizesPossibles = [],
      customizableParts = [],
      fillings = []
    }: ReqBodyCreateCake
  ): Promise<ICake | undefined> {
    if (fillings.length > MAX_LAYER_OF_FILLINGS[size]) {
      throw new ApiError(
        `it is only possible to have a maximum of ${MAX_LAYER_OF_FILLINGS[size]} layers of fillings in cakes of size '${size}'`,
        400
      );
    }

    const mainSizeIsInSizesPossibles = sizesPossibles.includes(size);

    if (!mainSizeIsInSizesPossibles) {
      throw new ApiError(
        "It is not possible to create this cake in this size",
        400
      );
    }

    const pricingWithoutFillingAndFrosting = pricePerSize[size];

    if (!pricingWithoutFillingAndFrosting) {
      throw new ApiError(
        "there isn't price value in pricePerSize for this size",
        400
      );
    }

    const pricePerSizeIsValid = this.validatePricePerSize(
      pricePerSize,
      sizesPossibles
    );

    if (!pricePerSizeIsValid) {
      throw new ApiError(
        "the sizes in pricePerSize must be in sizesPossibles",
        400
      );
    }

    try {
      const [
        typeValidated,
        categoriesValidated,
        fillingsValidated,
        frostingValidated
      ] = await Promise.all([
        this.cakeTypeService.validateCakeTypeInCake(type),
        this.categoryService.validateAllCategoriesInCake(categories),
        this.fillingService.validateAllFillingsInCake(fillings),
        this.frostingService.validateFrostingInCake(frosting)
      ]);

      const totalPricing = this.calculateTotalPricing(
        fillingsValidated,
        pricingWithoutFillingAndFrosting,
        frostingValidated
      );

      if (totalPricing < 0)
        throw new ApiError("totalPricing can't be negative number", 400);

      // const imageUrl = await this.filesService.uploadImageCake(imageCake, hostUrl);
      // if (!imageUrl) throw new ApiError("failed to upload image", 500);
      const imageUrl = "http://localhost:3001/api/images/chocolate-cake.png";

      return await this.cakeRepository.create({
        name,
        type: typeValidated,
        categories: categoriesValidated,
        fillings: fillingsValidated,
        frosting: frostingValidated,
        size,
        sizesPossibles,
        pricePerSize,
        totalPricing,
        customizableParts,
        imageUrl
      });
    } catch (error: any) {
      throw new ApiError(error.message, error.status);
    }
  }

  async update(
    hostUrl: string,
    id: string,
    type?: string,
    pricing?: number,
    imageCake?: Express.Multer.File,
    frosting?: string[],
    filling?: string,
    size?: string
  ): Promise<CakeResponseDB> {
    const cake: CakeResponseDB = await this.cakeRepository.findById(id);

    if (!cake) throw new ApiError("this cake isn't exists", 404);

    let newUrlImage: string | undefined = undefined;

    if (imageCake) {
      const filesService = new FilesService();

      newUrlImage = await filesService.updateImageCake(
        cake.imageUrl || "" /** ajeite depois*/,
        imageCake,
        hostUrl
      );
    }

    return await this.cakeRepository.update(
      id,
      type,
      pricing,
      newUrlImage,
      frosting,
      filling,
      size
    );
  }

  async delete(id: string): Promise<void> {
    await this.cakeRepository.delete(id);
  }

  calculateTotalPricing(
    fillings: IFilling[],
    pricingWithoutFillingAndFrosting: number,
    frosting?: IFrosting
  ): number {
    const totalPriceFillings: number = fillings.reduce(
      (acm, filling) => filling.price + acm,
      0
    );

    return (
      pricingWithoutFillingAndFrosting +
      totalPriceFillings +
      (frosting?.price || 0)
    );
  }

  validatePricePerSize(
    pricePerSize: PricePerSize,
    sizesPossibles: Size[]
  ): boolean {
    const sizesInPricesPerSize = Object.keys(pricePerSize);

    return sizesPossibles.every((size) => {
      return (
        pricePerSize[size] !== undefined && sizesInPricesPerSize.includes(size)
      );
    });
  }
}
