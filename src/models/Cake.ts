import mongoose from "mongoose";

export interface ICake {
  type: string;
  frosting?: string[];
  filling?: string;
  size?: string;
}

const cakeSchema = new mongoose.Schema<ICake>(
  {
    type: { type: String, required: true },
    frosting: {
      type: [String],
    },
    filling: { type: String },
    size: { type: String },
  },
  { timestamps: true }
);

export const Cake = mongoose.model<ICake>("Cake", cakeSchema);
