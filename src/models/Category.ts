import mongoose from "mongoose";
import { ICategory } from "../@types/Category";
import { ApiError } from "../utils/ApiError";
import { Cake } from "./Cake";

const categorySchema = new mongoose.Schema<ICategory>({
  category: { type: String, unique: true, required: true }
});

categorySchema.pre("findOneAndDelete", async function (next) {
  const categoryId: string | undefined = this.getFilter()?._id;

  if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
    next(new ApiError("id is not valid", 400));
    return;
  }

  try {
    await Cake.updateMany(
      { categories: categoryId },
      { $pull: { categories: categoryId } }
    );

    next();
  } catch (error) {
    next(
      new ApiError(
        "failed to delete this category of cakes that are using this category",
        500
      )
    );
  }

  next();
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
