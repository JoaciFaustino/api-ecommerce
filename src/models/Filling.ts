import mongoose from "mongoose";
import { IFilling } from "../@types/Filling";

const fillingSchema = new mongoose.Schema<IFilling>({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true }
});

export const Filling = mongoose.model<IFilling>("Filling", fillingSchema);
