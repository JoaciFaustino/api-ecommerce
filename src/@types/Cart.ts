import { Types } from "mongoose";
import { Size } from "./Cake";

export interface IPersonalizedCake {
  _id?: Types.ObjectId | string;
  cakeId: Types.ObjectId | string;
  type: string;
  frosting?: string;
  fillings: string[];
  size: Size;
  totalPricing: number;
  quantity: number;
  imageUrl: string;
}

export interface ICart {
  _id?: Types.ObjectId | string;
  cakes: IPersonalizedCake[];
}
