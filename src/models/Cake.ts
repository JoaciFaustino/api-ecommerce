import mongoose, { Types } from "mongoose";

export interface ICake {
  _id?: Types.ObjectId | string;
  type: string;
  pricing: number;
  frosting?: string[];
  filling?: string;
  size: string;
  boughts?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cakeSchema = new mongoose.Schema<ICake>(
  {
    type: { type: String, required: true },
    pricing: { type: Number, required: true },
    frosting: {
      type: [String]
    },
    filling: { type: String },
    size: { type: String, required: true },
    boughts: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const Cake = mongoose.model<ICake>("Cake", cakeSchema);
