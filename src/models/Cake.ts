import mongoose from "mongoose";
import {
  CUSTOMIZABLE_PARTS_ENUM,
  ICake,
  SIZES_POSSIBLES_ENUM
} from "../@types/Cake";

const cakeSchema = new mongoose.Schema<ICake>(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
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
    frosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Frosting"
    },
    fillings: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Filling" }],
      required: true,
      default: []
    },
    size: {
      type: String,
      enum: SIZES_POSSIBLES_ENUM,
      required: true
    },
    sizesPossibles: {
      type: [String],
      enum: SIZES_POSSIBLES_ENUM,
      required: true,
      default: []
    },
    pricePerSize: {
      pequeno: { type: Number, required: false },
      medio: { type: Number, required: false },
      grande: { type: Number, required: false },
      "extra-grande": { type: Number, required: false }
    },
    totalPricing: {
      type: Number,
      required: true
    },
    customizableParts: {
      type: [String],
      enum: CUSTOMIZABLE_PARTS_ENUM,
      required: true,
      default: []
    },
    imageUrl: {
      type: String,
      required: true
    },
    publicIdImage: {
      type: String
    },
    boughts: {
      type: Number,
      required: true,
      default: 0
    }
  },
  { timestamps: true }
);

export const Cake = mongoose.model<ICake>("Cake", cakeSchema);
