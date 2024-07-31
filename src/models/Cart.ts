import mongoose from "mongoose";
import { ICart } from "../@types/Cart";
import { SIZES_POSSIBLES_ENUM } from "../@types/Cake";

const cartSchema = new mongoose.Schema<ICart>({
  cakes: {
    type: [
      {
        cakeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cake",
          required: true
        },
        name: { type: String, required: true },
        type: { type: String, required: true },
        frosting: { type: String, required: false },
        fillings: { type: [String], required: false, default: [] },
        size: { type: String, enum: SIZES_POSSIBLES_ENUM, required: true },
        imageUrl: { type: String, required: true },
        totalPricing: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
      }
    ],
    required: true,
    default: []
  }
});

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
