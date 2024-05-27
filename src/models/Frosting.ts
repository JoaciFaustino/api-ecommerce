import mongoose from "mongoose";
import { IFrosting } from "../@types/Frosting";

const frostingSchema = new mongoose.Schema<IFrosting>({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true }
});

export const Frosting = mongoose.model<IFrosting>("Frosting", frostingSchema);
