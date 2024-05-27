import { Types } from "mongoose";
import { ICakeType } from "./CakeType";
import { ICategory } from "./Category";
import { IFrosting } from "./Frosting";
import { IFilling } from "./Filling";

export type SortByCakes =
  | { bougths: "descending" }
  | { created_at: "descending" }
  | { pricing: "descending" }
  | { pricing: "ascending" }
  | null;

export type CustomizablesParts = "filing" | "frosting" | "size" | "type";

export type Size = "pequeno" | "medio" | "grande" | "extra-grande";

export type PricePerSize = {
  [size in Size]?: number;
};

export interface ICake {
  _id?: Types.ObjectId | string;

  name: string;
  type: Types.ObjectId | ICakeType | string; //(VAI VIR DO DB)
  categories: Types.ObjectId | ICategory[] | string[]; //(VAI VIR DO DB)
  frosting?: Types.ObjectId | IFrosting; //(VAI VIR DO DB)
  filling?: Types.ObjectId | IFilling[]; //(VAI VIR DO DB) a quantidade vai depender do tamanho do bolo, se for "pequeno" pode ser 1, se for "medio" pode ter até 2 e se for "g" pode ter até 3

  size: Size;
  sizesPossibles: Size[];
  pricePerSize: PricePerSize;

  totalPricing: number; //pricePerSize + price of frostings + price of filling
  customizableParts: CustomizablesParts[];
  publicIdImage?: string;
  imageUrl: string;
  boughts?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
