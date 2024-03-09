import mongoose, { Types } from "mongoose";

export interface ICake {
  _id?: Types.ObjectId | string;
  type: string;
  pricing: number;
  frosting?: string[];
  filling?: string;
  size: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const cakeSchema = new mongoose.Schema<ICake>(
  {
    type: { type: String, required: true },
    frosting: {
      type: [String]
    },
    filling: { type: String },
    size: { type: String, required: true }
  },
  { timestamps: true }
);

export const Cake = mongoose.model<ICake>("Cake", cakeSchema);
