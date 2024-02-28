import mongoose, { Types } from "mongoose";
import { ICake } from "./Cake";

export interface IUser {
  name: string;
  userName: string;
  email: string;
  password: string;
  orders?: ICake[] | string[] | Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false, unique: true },
    orders: {
      type: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Cake", required: true },
      ],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
