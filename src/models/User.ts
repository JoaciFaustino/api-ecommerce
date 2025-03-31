import mongoose, { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId | string;
  cartId: Types.ObjectId | string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false, unique: true },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true
    },
    role: { type: String, required: false, default: "user" }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
