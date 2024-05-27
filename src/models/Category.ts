import mongoose from "mongoose";
import { ICategory } from "../@types/Category";

const categorySchema = new mongoose.Schema<ICategory>({
  category: { type: String, unique: true, required: true }
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
