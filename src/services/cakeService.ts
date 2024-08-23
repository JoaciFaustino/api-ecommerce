import { CakeRepository } from "../repositories/cakeRepository";
import { ApiError } from "../utils/ApiError";
import { FilesService } from "./filesService";
import { SORT_BY_OPTIONS, TypeKeysSortBy } from "../@types/SortBy";
import { IFrosting } from "../@types/Frosting";
import { IFilling } from "../@types/Filling";
import {
  CustomizablesParts,
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
import {
  getPrevAndNextUrl,
  normalizeQueryString,
  normalizeQueryStringArray
} from "../utils/queryString";

type getAllReturn = {
  cakes?: ICake[];
  maxPages: number;
  prevUrl: string | null;
  nextUrl: string | null;
};

export class CakeService {
  constructor(
    private cakeRepository = new CakeRepository(),
    private fillingService = new FillingService(),
    private categoryService = new CategoryService(),
    private cakeTypeService = new CakeTypeService(),
    private frostingService = new FrostingService(),
    private filesService = new FilesService()
  ) {}

  async getAll(
    url: string,
    {
      limit = "20",
      page = "1",
      sortBy = "popularity",
      search = [],
      category = [],
      filling = [],
      frosting = [],
      type = [],
      size = []
    }: IQueryParamsGetAll
  ): Promise<getAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;
    const quantityCakesOnDb = await this.cakeRepository.countDocs();

    if (!quantityCakesOnDb) throw new ApiError("failed to get maxPages", 500);

    const maxPages =
      quantityCakesOnDb !== 0 ? Math.ceil(quantityCakesOnDb / limitNumber) : 1;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const sortByLastValue: string | undefined = normalizeQueryString(sortBy);
    const newSortBy = SORT_BY_OPTIONS.includes(
      sortByLastValue as TypeKeysSortBy
    )
      ? (sortBy as TypeKeysSortBy)
      : "popularity";

    const searchByName: string | undefined = normalizeQueryString(search);

    const typeFilters: string[] = normalizeQueryStringArray(type);
    const categoryFilters: string[] = normalizeQueryStringArray(category);
    const fillingFilters: string[] = normalizeQueryStringArray(filling);
    const frostingFilters: string[] = normalizeQueryStringArray(frosting);
    const sizeFilters: string[] = normalizeQueryStringArray(size);

    const sizeFiltersValids = sizeFilters.filter((size) =>
      SIZES_POSSIBLES_ENUM.includes(size as Size)
    );

    const cakes: ICake[] | undefined = await this.cakeRepository.getAll(
      limitNumber,
      pageNumber,
      newSortBy,
      categoryFilters,
      fillingFilters,
      frostingFilters,
      typeFilters,
      sizeFiltersValids,
      searchByName
    );

    if (!cakes) {
      return { cakes: undefined, maxPages: 0, prevUrl: null, nextUrl: null };
    }

    if (cakes.length === 0) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const { nextUrl, prevUrl } = getPrevAndNextUrl(url, pageNumber, maxPages);

    return { cakes, maxPages, nextUrl, prevUrl };
  }

  async findById(id: string): Promise<ICake | undefined> {
    return await this.cakeRepository.findById(id);
  }

  async create(
    hostUrl: string,
    imageCake: Express.Multer.File,
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
    const validationFillingsLayers = this.validateMaxLayersOfFillings(
      fillings,
      size,
      sizesPossibles,
      customizableParts
    );

    if (!validationFillingsLayers.isValid) {
      throw new ApiError(validationFillingsLayers.errorMessage, 400);
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

    if (!this.validatePricePerSize(pricePerSize, sizesPossibles)) {
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

      const imageUrl = await this.filesService.uploadImageCake(
        imageCake,
        hostUrl
      );

      if (!imageUrl) throw new ApiError("failed to upload image", 500);

      const sizesPossiblesNormalized = !customizableParts.includes("size")
        ? [size]
        : sizesPossibles;

      return await this.cakeRepository.create({
        name,
        type: typeValidated,
        categories: categoriesValidated,
        fillings: fillingsValidated,
        frosting: frostingValidated,
        size,
        sizesPossibles: sizesPossiblesNormalized,
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
  ): Promise<ICake | undefined> {
    const cake: ICake | undefined = await this.cakeRepository.findById(id);

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

  private validatePricePerSize(
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

  private validateMaxLayersOfFillings(
    fillings: string[],
    defaultSize: Size,
    sizesPossibles: Size[],
    customizableParts: CustomizablesParts[]
  ): { isValid: true } | { isValid: false; errorMessage: string } {
    if (
      !customizableParts.includes("filing") &&
      customizableParts.includes("size")
    ) {
      const fillingsIsValid = sizesPossibles.some(
        (sizePossible) => fillings.length <= MAX_LAYER_OF_FILLINGS[sizePossible]
      );

      if (!fillingsIsValid) {
        return {
          isValid: false,
          errorMessage:
            "this cake cannot have this number of filling layers because one of the sizesPossibles does not support this number of layers"
        };
      }

      return { isValid: true };
    }

    if (fillings.length > MAX_LAYER_OF_FILLINGS[defaultSize]) {
      return {
        isValid: false,
        errorMessage: `it is only possible to have a maximum of ${MAX_LAYER_OF_FILLINGS[defaultSize]} layers of fillings in cakes of size '${defaultSize}'`
      };
    }

    return { isValid: true };
  }
}
