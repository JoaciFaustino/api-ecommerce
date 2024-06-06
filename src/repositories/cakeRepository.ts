import { CakeResponseDB } from "../@types/DBresponses";
import { Cake } from "../models/Cake";
import { TypeKeysSortBy, typeSortByObj } from "../@types/SortBy";
import { ICake } from "../@types/Cake";
import { ICakeType } from "../@types/CakeType";
import { ICategory } from "../@types/Category";
import { IFilling } from "../@types/Filling";
import { IFrosting } from "../@types/Frosting";
import { SORT_BY_OBJS } from "../utils/constants";

export class CakeRepository {
  constructor() {}

  async countDocs(): Promise<number> {
    return await Cake.countDocuments({});
  }

  async getAll(
    limit: number,
    page: number,
    sortBy: TypeKeysSortBy,
    categoryIdFilters: string[] = [],
    fillingIdFilters: string[] = [],
    frostingIdFilters: string[] = [],
    typeIdFilters: string[] = [],
    sizeFilters: string[] = []
  ): Promise<ICake[] | undefined> {
    const sortByObj: typeSortByObj = SORT_BY_OBJS[sortBy];

    const categoriesFilterObj =
      categoryIdFilters.length > 0
        ? { categories: { $in: categoryIdFilters } }
        : {};

    const fillingIdFiltersObj =
      fillingIdFilters.length > 0
        ? { fillings: { $in: fillingIdFilters } }
        : {};

    const frostingIdFiltersObj =
      frostingIdFilters.length > 0
        ? { frosting: { $in: frostingIdFilters } }
        : {};

    const typeIdFiltersObj =
      typeIdFilters.length > 0 ? { type: { $in: typeIdFilters } } : {};

    const sizeFiltersObj =
      sizeFilters.length > 0 ? { size: { $in: sizeFilters } } : {};

    const cakesRes = await Cake.find({
      ...categoriesFilterObj,
      ...fillingIdFiltersObj,
      ...frostingIdFiltersObj,
      ...typeIdFiltersObj,
      ...sizeFiltersObj
    })
      .limit(limit)
      .skip(limit * (page - 1))
      .sort(sortByObj)
      .populate<{ type: ICakeType }>("type")
      .populate<{ categories: ICategory }>("categories")
      .populate<{ fillings: IFilling }>("fillings")
      .populate<{ frosting: IFrosting }>("frosting");

    if (!cakesRes) return;

    const cakes: ICake[] = cakesRes.map((cake) => {
      const categoriesNormalized /*: string[]*/ = Array.isArray(cake.categories)
        ? cake.categories /*.map((category) => category.category)*/
        : [cake.categories]; /*.map((category) => category.category)*/

      const fillingsNormalized: IFilling[] = Array.isArray(cake.fillings)
        ? cake.fillings
        : [cake.fillings];

      return {
        _id: cake._id,
        name: cake.name,
        type: cake.type /*.type*/,
        size: cake.size,
        sizesPossibles: cake.sizesPossibles,
        pricePerSize: cake.pricePerSize,
        fillings: fillingsNormalized,
        customizableParts: cake.customizableParts,
        totalPricing: cake.totalPricing,
        boughts: cake.boughts,
        categories: categoriesNormalized,
        createdAt: cake.createdAt,
        imageUrl: cake.imageUrl,
        frosting: cake.frosting,
        updatedAt: cake.updatedAt
      };
    });

    return cakes;
  }

  async findById(id: string): Promise<CakeResponseDB> {
    return await Cake.findById(id);
  }

  async create({
    name,
    type,
    categories,
    size,
    sizesPossibles,
    pricePerSize,
    totalPricing,
    customizableParts,
    imageUrl,
    frosting,
    fillings
  }: ICake): Promise<ICake | undefined> {
    const cake: ICake = {
      name,
      type,
      categories,
      size,
      sizesPossibles,
      pricePerSize,
      totalPricing,
      customizableParts,
      imageUrl,
      frosting,
      fillings
    };

    const cakeCreated = await Cake.create<ICake>({
      name,
      type,
      categories,
      size,
      sizesPossibles,
      pricePerSize,
      totalPricing,
      customizableParts,
      imageUrl,
      frosting,
      fillings
    });

    if (!cake) return;

    return {
      _id: cake._id,
      name: cake.name,
      type: cake.type,
      categories: cake.categories,
      size: cake.size,
      sizesPossibles: cake.sizesPossibles,
      pricePerSize: cake.pricePerSize,
      totalPricing: cake.totalPricing,
      customizableParts: cake.customizableParts,
      imageUrl: cake.imageUrl,
      frosting: cake.frosting,
      fillings: cake.fillings,
      boughts: cake.boughts,
      createdAt: cake.createdAt,
      updatedAt: cake.updatedAt
    };
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
