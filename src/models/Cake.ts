import mongoose from "mongoose";
import { CustomizablesParts, ICake, Size } from "../@types/Cake";

const sizesPossiblesEnum: Size[] = [
  "pequeno",
  "medio",
  "grande",
  "extra-grande"
];

const customizablesPartsEnum: CustomizablesParts[] = [
  "filing",
  "frosting",
  "size",
  "type"
];

const cakeSchema = new mongoose.Schema<ICake>(
  {
    name: { type: String, required: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CakeType",
      required: true
    },
    categories: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
      required: true,
      default: []
    },
    frosting: { type: mongoose.Schema.Types.ObjectId, ref: "Frosting" },
    filling: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filling" }],
      required: true,
      default: []
    },
    size: {
      type: String,
      enum: sizesPossiblesEnum,
      required: true
    },
    sizesPossibles: {
      type: [String],
      enum: sizesPossiblesEnum,
      required: true,
      default: []
    },
    pricePerSize: {
      pequeno: { type: Number, required: false },
      medio: { type: Number, required: false },
      grande: { type: Number, required: false },
      "extra-grande": { type: Number, required: false }
    },
    totalPricing: { type: Number, required: true },
    customizableParts: {
      type: [String],
      enum: customizablesPartsEnum,
      required: true,
      default: []
    },
    imageUrl: { type: String, required: true },
    publicIdImage: { type: String },
    boughts: { type: Number, required: true, default: 0 }
  },
  { timestamps: true }
);

export const Cake = mongoose.model<ICake>("Cake", cakeSchema);
