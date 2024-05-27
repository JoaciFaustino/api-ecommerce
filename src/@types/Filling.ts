import { Types } from "mongoose";

export interface IFilling {
  _id?: Types.ObjectId | string;
  name: string;
  price: number;
}
