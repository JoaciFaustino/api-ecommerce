import { Types } from "mongoose";
import { ICakeType } from "./CakeType";
import { ICategory } from "./Category";
import { IFrosting } from "./Frosting";
import { IFilling } from "./Filling";

export const CUSTOMIZABLE_PARTS_ENUM = [
  "fillings",
  "frosting",
  "size",
  "type"
] as const;

export type CustomizablesParts = (typeof CUSTOMIZABLE_PARTS_ENUM)[number];

export const SIZES_POSSIBLES_ENUM = [
  "pequeno",
  "medio",
  "grande",
  "extra-grande"
] as const;

export type Size = (typeof SIZES_POSSIBLES_ENUM)[number];

export type PricePerSize = {
  [key in Size]?: number;
};

export interface ICake {
  _id?: Types.ObjectId | string;

  name: string;
  type: ICakeType | string;
  categories?: ICategory[] | string[];
  frosting?: IFrosting | string;
  fillings?: IFilling[] | string[];
  size: Size;
  sizesPossibles: Size[];
  pricePerSize: PricePerSize;

  totalPricing: number;
  customizableParts: CustomizablesParts[];
  imageUrl: string;
  publicIdImage?: string;
  boughts?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
