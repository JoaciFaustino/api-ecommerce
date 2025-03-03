import mongoose from "mongoose";
import { ICakeType } from "../@types/CakeType";
import { Cake } from "./Cake";
import { ApiError } from "../utils/ApiError";

const cakeTypeSchema = new mongoose.Schema<ICakeType>({
  type: { type: String, required: true, unique: true }
});
cakeTypeSchema.pre("findOneAndDelete", async function (next) {
  const cakeTypeId: string | undefined = this.getFilter()?._id;

  if (!cakeTypeId || !mongoose.Types.ObjectId.isValid(cakeTypeId)) {
    next(new ApiError("id is not valid", 400));
    return;
  }

  try {
    await Cake.deleteMany({ type: cakeTypeId });

    next();
  } catch (error) {
    next(new ApiError("failed to delete the cakes using that cake type", 500));
  }
});

export const CakeType = mongoose.model<ICakeType>("CakeType", cakeTypeSchema);
