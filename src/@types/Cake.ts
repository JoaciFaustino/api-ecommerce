import { Types } from "mongoose";
import { ICakeType } from "./CakeType";
import { ICategory } from "./Category";
import { IFrosting } from "./Frosting";
import { IFilling } from "./Filling";

export const CUSTOMIZABLE_PARTS_ENUM = [
  "filing",
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
  type: Types.ObjectId | ICakeType | string;
  categories?: Types.ObjectId[] | ICategory[] | string[];
  frosting?: Types.ObjectId | IFrosting;
  fillings?: Types.ObjectId[] | IFilling[];
  size: Size;
  sizesPossibles: Size[];
  pricePerSize: PricePerSize;

  totalPricing: number;
  customizableParts: CustomizablesParts[];
  publicIdImage?: string;
  imageUrl?: string;
  boughts?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
