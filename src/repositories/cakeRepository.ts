import { Cake } from "../models/Cake";
import { TypeKeysSortBy, typeSortByObj } from "../@types/SortBy";
import { ICake } from "../@types/Cake";
import { SORT_BY_OBJS } from "../utils/constants";
import {
  JoinColectionData,
  getJoinPipelines,
  leaveJoinsWithoutFiltersLast
} from "../lib/mongoose";
import { ICategory } from "../@types/Category";
import { ICakeType } from "../@types/CakeType";
import { IFilling } from "../@types/Filling";
import { IFrosting } from "../@types/Frosting";

export class CakeRepository {
  constructor() {}

  async countDocs(): Promise<number | undefined> {
    return await Cake.countDocuments({});
  }

  async getAll(
    limit: number,
    page: number,
    sortBy: TypeKeysSortBy,
    categoryFilters: string[] = [],
    fillingFilters: string[] = [],
    frostingFilters: string[] = [],
    typeFilters: string[] = [],
    sizeFilters: string[] = []
  ): Promise<ICake[] | undefined> {
    const sortByObj: typeSortByObj = SORT_BY_OBJS[sortBy];

    const joinTypesData: JoinColectionData = {
      colectionName: "caketypes",
      localField: "type",
      relationship: "one-to-one",
      filters: typeFilters,
      joinFieldNameToQuery: "type"
    };

    const joinCategoriesData: JoinColectionData = {
      colectionName: "categories",
      localField: "categories",
      relationship: "one-to-many",
      filters: categoryFilters,
      joinFieldNameToQuery: "category"
    };

    const joinFillingsData: JoinColectionData = {
      colectionName: "fillings",
      localField: "fillings",
      relationship: "one-to-many",
      filters: fillingFilters,
      joinFieldNameToQuery: "name"
    };

    const joinFrostingData: JoinColectionData = {
      colectionName: "frostings",
      localField: "frosting",
      relationship: "one-to-one",
      filters: frostingFilters,
      joinFieldNameToQuery: "name"
    };

    const joinTypes = getJoinPipelines(joinTypesData);
    const joinCategories = getJoinPipelines(joinCategoriesData);
    const joinFillings = getJoinPipelines(joinFillingsData);
    const joinFrosting = getJoinPipelines(joinFrostingData);

    const sequencedJoins = leaveJoinsWithoutFiltersLast([
      joinTypes,
      joinCategories,
      joinFillings,
      joinFrosting
    ]);

    const sizeFilterObj =
      sizeFilters.length > 0
        ? { $match: { size: { $in: sizeFilters } } }
        : { $match: {} };

    const cakes: ICake[] | undefined = await Cake.aggregate<ICake>([
      sizeFilterObj,
      ...sequencedJoins,
      // {
      //   $group: {
      //     _id: "$_id",
      //     name: { $first: "$name" },
      //     type: { $first: "$typeDetails.type" },
      //     categories: { $first: "$categoriesDetails.category" },
      //     fillings: { $first: "$fillingsDetails" },
      //     frosting: { $first: "$frostingDetails" },
      //     size: { $first: "$size" },
      //     sizesPossibles: { $first: "$sizesPossibles" },
      //     customizableParts: { $first: "$customizableParts" },
      //     pricePerSize: { $first: "$pricePerSize" },
      //     totalPricing: { $first: "$totalPricing" },
      //     imageUrl: { $first: "$imageUrl" },
      //     boughts: { $first: "$boughts" },
      //     createdAt: { $first: "$createdAt" },
      //     updatedAt: { $first: "$updatedAt" }
      //   }
      // },
      {
        $project: {
          _id: 1,
          name: 1,
          type: /**1 */ "$typeDetails.type",
          categories: /**1 "*/ "$categoriesDetails.category",
          fillings: /**1*/ "$fillingsDetails",
          frosting: /**1 */ "$frostingDetails",
          size: 1,
          sizesPossibles: 1,
          customizableParts: 1,
          pricePerSize: 1,
          totalPricing: 1,
          imageUrl: 1,
          boughts: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ])
      .sort(sortByObj)
      .skip(limit * (page - 1))
      .limit(limit);

    if (!cakes) return;

    return cakes;
  }

  async findById(id: string): Promise<ICake | undefined> {
    const cake = await Cake.findById(id)
      .populate<{ type: ICakeType }>("type")
      .populate<{ categories: ICategory }>("categories")
      .populate<{ fillings: IFilling }>("fillings")
      .populate<{ frosting: IFrosting }>("frosting");

    if (!cake) {
      return;
    }

    const categoriesNormalized: ICategory[] = Array.isArray(cake.categories)
      ? cake.categories
      : [cake.categories];

    const fillingsNormalized: IFilling[] = Array.isArray(cake.fillings)
      ? cake.fillings
      : [cake.fillings];

    return {
      _id: cake._id,
      name: cake.name,
      type: cake.type,
      size: cake.size,
      customizableParts: cake.customizableParts,
      pricePerSize: cake.pricePerSize,
      sizesPossibles: cake.sizesPossibles,
      totalPricing: cake.totalPricing,
      boughts: cake.boughts,
      categories: categoriesNormalized,
      fillings: fillingsNormalized,
      frosting: cake.frosting,
      imageUrl: cake.imageUrl,
      createdAt: cake.createdAt,
      updatedAt: cake.updatedAt
    };
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
    if (!imageUrl) {
      return;
    }

    const cakeCreated = await Cake.create({
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

    if (!cakeCreated) return;

    return {
      _id: cakeCreated._id,
      name: cakeCreated.name,
      type: cakeCreated.type,
      categories: cakeCreated.categories,
      size: cakeCreated.size,
      sizesPossibles: cakeCreated.sizesPossibles,
      pricePerSize: cakeCreated.pricePerSize,
      totalPricing: cakeCreated.totalPricing,
      customizableParts: cakeCreated.customizableParts,
      imageUrl: cakeCreated.imageUrl,
      frosting: cakeCreated.frosting,
      fillings: cakeCreated.fillings,
      boughts: cakeCreated.boughts,
      createdAt: cakeCreated.createdAt,
      updatedAt: cakeCreated.updatedAt
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
  ): Promise<ICake | undefined> {
    const cakeUpdated = await Cake.findByIdAndUpdate(
      id,
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

    if (!cakeUpdated) {
      return;
    }

    return {
      _id: cakeUpdated._id,
      name: cakeUpdated.name,
      type: cakeUpdated.type,
      categories: cakeUpdated.categories,
      size: cakeUpdated.size,
      sizesPossibles: cakeUpdated.sizesPossibles,
      pricePerSize: cakeUpdated.pricePerSize,
      totalPricing: cakeUpdated.totalPricing,
      customizableParts: cakeUpdated.customizableParts,
      imageUrl: cakeUpdated.imageUrl,
      frosting: cakeUpdated.frosting,
      fillings: cakeUpdated.fillings,
      boughts: cakeUpdated.boughts,
      createdAt: cakeUpdated.createdAt,
      updatedAt: cakeUpdated.updatedAt
    };
  }

  async delete(id: string): Promise<void> {
    await Cake.findByIdAndDelete({ _id: id });
  }
}
