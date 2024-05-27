import { Types } from "mongoose";

export interface ICakeType {
  _id?: Types.ObjectId | string;
  type: string;
}
