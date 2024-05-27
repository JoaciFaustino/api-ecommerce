import { Types } from "mongoose";

export interface IFrosting {
  _id?: Types.ObjectId | string;
  name: string;
  price: number;
}
