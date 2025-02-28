import { CakeRepository } from "../repositories/cakeRepository";
import { ApiError } from "../utils/ApiError";
import { FilesService } from "./filesService";
import {
  SORT_BY_CAKES_OPTIONS,
  TypeKeysSortByCakes
} from "../@types/SortByCake";
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
import { IQueryParamsGetAllCakes } from "../@types/QueryParams";
import { ReqBodyCreateCake, ReqBodyUpdateCake } from "../@types/ReqBody";
import {
  getPrevAndNextUrl,
  normalizeQueryString,
  normalizeQueryStringArray
} from "../utils/queryString";
import { ICategory } from "../@types/Category";
import { ICakeType } from "../@types/CakeType";
import { areStringArraysEqual } from "../utils/arrayUtils";

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
    }: IQueryParamsGetAllCakes
  ): Promise<getAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;
    const quantityCakesOnDb = await this.cakeRepository.countDocs();

    const maxPages =
      quantityCakesOnDb !== 0 ? Math.ceil(quantityCakesOnDb / limitNumber) : 1;

    if (pageNumber > maxPages) {
      throw new ApiError("the page requested isn't exists", 404);
    }

    const sortByLastValue: string | undefined = normalizeQueryString(sortBy);
    const newSortBy = SORT_BY_CAKES_OPTIONS.includes(
      sortByLastValue as TypeKeysSortByCakes
    )
      ? (sortBy as TypeKeysSortByCakes)
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

      if (!imageUrl) {
        throw new ApiError("failed to upload image", 500);
      }

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
    id: string,
    hostUrl: string,
    imageCake: Express.Multer.File | undefined,
    {
      name,
      type,
      size,
      pricePerSize,
      frosting,
      categories,
      sizesPossibles,
      customizableParts,
      fillings
    }: ReqBodyUpdateCake
  ): Promise<ICake | undefined> {
    const cake: ICake | undefined = await this.cakeRepository.findById(id);

    if (!cake) {
      throw new ApiError("this cake isn't exists", 404);
    }

    const notUpdatedType = (cake.type as ICakeType).type;
    const notUpdatedFrosting = (cake.frosting as IFrosting | undefined)?.name;
    const notUpdatedFillings = (cake.fillings as IFilling[]).map(
      ({ name }) => name
    );
    const notUpdatedCategories = (cake.categories as ICategory[]).map(
      ({ category }) => category
    );

    const defaultPricePerSize = pricePerSize || cake.pricePerSize;

    const validationFillingsLayers = this.validateMaxLayersOfFillings(
      fillings || notUpdatedFillings,
      size || cake.size,
      sizesPossibles || cake.sizesPossibles,
      customizableParts || cake.customizableParts
    );

    if (!validationFillingsLayers.isValid) {
      throw new ApiError(validationFillingsLayers.errorMessage, 400);
    }

    const newSizesPossibles = sizesPossibles || cake.sizesPossibles;
    const mainSizeIsInSizesPossibles = newSizesPossibles.includes(
      size || cake.size
    );

    if (!mainSizeIsInSizesPossibles) {
      throw new ApiError("This size is not possible in this cake", 400);
    }

    const newSize = size || cake.size;
    //prettier-ignore
    const pricingWithoutFillingAndFrosting = 
      (pricePerSize || cake.pricePerSize)[newSize];

    if (!pricingWithoutFillingAndFrosting) {
      throw new ApiError(
        "there isn't price value in pricePerSize for this size",
        400
      );
    }

    if (!this.validatePricePerSize(defaultPricePerSize, newSizesPossibles)) {
      throw new ApiError(
        "the sizes in pricePerSize must be in sizesPossibles",
        400
      );
    }

    try {
      const validateTypePromise = async () =>
        type && type !== notUpdatedType
          ? await this.cakeTypeService.validateCakeTypeInCake(type)
          : undefined;

      const validateCategoriesPromise = async () =>
        categories && !areStringArraysEqual(categories, notUpdatedCategories)
          ? await this.categoryService.validateAllCategoriesInCake(categories)
          : undefined;

      const validateFillingsPromise = async () =>
        fillings && !areStringArraysEqual(fillings, notUpdatedFillings)
          ? await this.fillingService.validateAllFillingsInCake(fillings)
          : undefined;

      const validateFrostingPromise = async () =>
        frosting && frosting !== notUpdatedFrosting
          ? await this.frostingService.validateFrostingInCake(frosting)
          : undefined;

      const [
        newTypeValidated,
        newCategoriesValidated,
        newFillingsValidated,
        newFrostingValidated
      ] = await Promise.all([
        validateTypePromise(),
        validateCategoriesPromise(),
        validateFillingsPromise(),
        validateFrostingPromise()
      ]);

      const totalPricing = this.calculateTotalPricing(
        newFillingsValidated || (cake.fillings as IFilling[] | undefined) || [],
        pricingWithoutFillingAndFrosting,
        newFrostingValidated || (cake.frosting as IFrosting | undefined)
      );

      if (totalPricing < 0) {
        throw new ApiError("totalPricing can't be negative number", 400);
      }

      let newUrlImage: string | undefined = undefined;

      if (imageCake) {
        const filesService = new FilesService();

        newUrlImage = await filesService.updateImageCake(
          cake.imageUrl,
          imageCake,
          hostUrl
        );
      }

      const sizesPossiblesNormalized = !(
        customizableParts || cake.customizableParts
      ).includes("size")
        ? [size || cake.size]
        : sizesPossibles;

      return await this.cakeRepository.update(id, {
        name,
        type: newTypeValidated,
        categories: newCategoriesValidated,
        fillings: newFillingsValidated,
        frosting: frosting !== null ? newFrostingValidated : null,
        sizesPossibles: sizesPossiblesNormalized,
        customizableParts,
        size,
        imageUrl: newUrlImage,
        pricePerSize,
        totalPricing
      });
    } catch (error: any) {
      throw new ApiError(error.message, error.status);
    }
  }

  async delete(id: string): Promise<void> {
    const cake = await this.findById(id);

    if (!cake) {
      throw new ApiError("cake not found", 404);
    }

    const result = this.filesService.deleteImageCake(cake.imageUrl);

    if (!result) {
      throw new ApiError("failed to delete the image", 500);
    }

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
      !customizableParts.includes("fillings") &&
      customizableParts.includes("size")
    ) {
      const fillingsIsValid = sizesPossibles.every(
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
