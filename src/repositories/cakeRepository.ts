import { Cake } from "../models/Cake";
import { ICake } from "../@types/Cake";
import {
  SORT_BY_CAKES_OBJS,
  TypeKeysSortByCakes,
  typeSortByCakesObj
} from "../@types/SortByCake";
import {
  JoinColectionData,
  MatchPipeline,
  getJoinPipelines,
  leaveJoinsWithoutFiltersLast
} from "../lib/mongoose";
import { ICategory } from "../@types/Category";
import { ICakeType } from "../@types/CakeType";
import { IFilling } from "../@types/Filling";
import { IFrosting } from "../@types/Frosting";
import { UpdateQuery } from "mongoose";

type CakeWithoutFrosting = Omit<ICake, "frosting">;
type CakeToUpdate = Partial<
  CakeWithoutFrosting & { frosting?: IFrosting | string | null }
>;

export class CakeRepository {
  constructor() {}

  async countDocs(): Promise<number> {
    return await Cake.countDocuments({});
  }

  async getAll(
    limit: number,
    page: number,
    sortBy: TypeKeysSortByCakes,
    categoryFilters: string[] = [],
    fillingFilters: string[] = [],
    frostingFilters: string[] = [],
    typeFilters: string[] = [],
    sizeFilters: string[] = [],
    searchByName?: string
  ): Promise<ICake[] | undefined> {
    const sortByObj: typeSortByCakesObj = SORT_BY_CAKES_OBJS[sortBy];

    const joinTypesData: JoinColectionData = {
      colectionName: "caketypes",
      localField: "type",
      relationship: "one-to-one",
      filters: searchByName ? [] : typeFilters,
      joinFieldNameToQuery: "type"
    };

    const joinCategoriesData: JoinColectionData = {
      colectionName: "categories",
      localField: "categories",
      relationship: "one-to-many",
      filters: searchByName ? [] : categoryFilters,
      joinFieldNameToQuery: "category"
    };

    const joinFillingsData: JoinColectionData = {
      colectionName: "fillings",
      localField: "fillings",
      relationship: "one-to-many",
      filters: searchByName ? [] : fillingFilters,
      joinFieldNameToQuery: "name"
    };

    const joinFrostingData: JoinColectionData = {
      colectionName: "frostings",
      localField: "frosting",
      relationship: "one-to-one",
      filters: searchByName ? [] : frostingFilters,
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

    const sizeFilterPipeline: MatchPipeline[] =
      searchByName || sizeFilters.length === 0
        ? []
        : [{ $match: { size: { $in: sizeFilters } } }];

    const searchByNamePipeline: MatchPipeline[] = !searchByName
      ? []
      : [{ $match: { name: { $regex: searchByName, $options: "i" } } }];

    const cakes: ICake[] | undefined = await Cake.aggregate<ICake>([
      ...searchByNamePipeline,
      ...sizeFilterPipeline,
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
      .populate<{ categories: ICategory[] | undefined }>("categories")
      .populate<{ fillings: IFilling[] | undefined }>("fillings")
      .populate<{ frosting: IFrosting | undefined }>("frosting");

    if (!cake) {
      return;
    }

    const { categories, fillings, frosting } = cake;

    const categoriesNormalized =
      categories?.map(({ category }) => category) || [];

    const fillingsNormalized =
      fillings?.map(({ name, price }) => ({ name, price })) || [];

    const frostingNormalized = frosting
      ? { name: frosting.name, price: frosting.price }
      : undefined;

    return {
      _id: cake._id,
      name: cake.name,
      type: cake.type.type,
      size: cake.size,
      customizableParts: cake.customizableParts,
      pricePerSize: cake.pricePerSize,
      sizesPossibles: cake.sizesPossibles,
      totalPricing: cake.totalPricing,
      boughts: cake.boughts,
      categories: categoriesNormalized,
      fillings: fillingsNormalized,
      frosting: frostingNormalized,
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
    {
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
    }: CakeToUpdate
  ): Promise<ICake | undefined> {
    const updateData: Partial<ICake> & { $unset?: Record<string, any> } = {
      name,
      type,
      categories,
      size,
      sizesPossibles,
      pricePerSize,
      totalPricing,
      customizableParts,
      imageUrl,
      fillings
    };

    if (frosting === null) {
      updateData.$unset = { frosting: 1 };
    }

    if (frosting !== null) {
      updateData.frosting = frosting;
    }

    const cake = await Cake.findByIdAndUpdate(id, updateData, { new: true })
      .populate<{ type: ICakeType }>("type")
      .populate<{ categories: ICategory[] | undefined }>("categories")
      .populate<{ fillings: IFilling[] | undefined }>("fillings")
      .populate<{ frosting: IFrosting | undefined }>("frosting");

    if (!cake) {
      return;
    }

    const categoriesNormalized =
      cake.categories?.map(({ category }) => category) || [];

    const fillingsNormalized =
      cake.fillings?.map(({ name, price }) => ({ name, price })) || [];

    const frostingNormalized = cake.frosting
      ? { name: cake.frosting.name, price: cake.frosting.price }
      : undefined;

    return {
      _id: cake._id,
      name: cake.name,
      type: cake.type.type,
      size: cake.size,
      customizableParts: cake.customizableParts,
      pricePerSize: cake.pricePerSize,
      sizesPossibles: cake.sizesPossibles,
      totalPricing: cake.totalPricing,
      boughts: cake.boughts,
      categories: categoriesNormalized,
      fillings: fillingsNormalized,
      frosting: frostingNormalized,
      imageUrl: cake.imageUrl,
      createdAt: cake.createdAt,
      updatedAt: cake.updatedAt
    };
  }

  async delete(id: string): Promise<void> {
    await Cake.findByIdAndDelete({ _id: id });
  }

  async increaseTheBoughtsOfTheCake(
    id: string,
    quantityToIncrease: number
  ): Promise<void> {
    await Cake.updateOne(
      { _id: id },
      { $inc: { boughts: quantityToIncrease } }
    );

    return;
  }
}
