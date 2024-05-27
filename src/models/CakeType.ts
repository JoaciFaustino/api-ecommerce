import mongoose from "mongoose";
import { ICakeType } from "../@types/CakeType";

const cakeTypeSchema = new mongoose.Schema<ICakeType>({
  type: { type: String, required: true, unique: true }
});

export const CakeType = mongoose.model<ICakeType>("CakeType", cakeTypeSchema);
