import mongoose, { Types } from "mongoose";
import { ICake } from "./Cake";

export interface IOrder {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  cakes: ICake[];
  createdAt?: Date;
  updatedAt?: Date;
}

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cakes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cake" }],
      validate: [
        (cakes: any) => Array.isArray(cakes) && cakes.length > 0,
        "Order must have cakes",
      ],
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
