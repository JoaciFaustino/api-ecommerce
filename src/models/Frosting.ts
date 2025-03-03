import mongoose from "mongoose";
import { IFrosting } from "../@types/Frosting";
import { ApiError } from "../utils/ApiError";
import { Cake } from "./Cake";

const frostingSchema = new mongoose.Schema<IFrosting>({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true }
});
frostingSchema.pre("findOneAndDelete", async function (next) {
  const frostingId: string | undefined = this.getFilter()?._id;

  if (!frostingId || !mongoose.Types.ObjectId.isValid(frostingId)) {
    next(new ApiError("id is not valid", 400));
    return;
  }

  try {
    await Cake.updateMany(
      { frosting: frostingId },
      { $unset: { frosting: 1 } }
    );

    next();
  } catch (error) {
    next(
      new ApiError(
        "failed to delete this frosting of cakes that are using this frosting",
        500
      )
    );
  }
});

export const Frosting = mongoose.model<IFrosting>("Frosting", frostingSchema);
