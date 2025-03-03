import mongoose from "mongoose";
import { IFilling } from "../@types/Filling";
import { ApiError } from "../utils/ApiError";
import { Cake } from "./Cake";

const fillingSchema = new mongoose.Schema<IFilling>({
  name: { type: String, unique: true, required: true },
  price: { type: Number, required: true }
});
fillingSchema.pre("findOneAndDelete", async function (next) {
  const fillingId: string | undefined = this.getFilter()?._id;

  if (!fillingId || !mongoose.Types.ObjectId.isValid(fillingId)) {
    next(new ApiError("id is not valid", 400));
    return;
  }

  try {
    await Cake.updateMany(
      { fillings: fillingId },
      { $pull: { fillings: fillingId } }
    );

    next();
  } catch (error) {
    next(
      new ApiError(
        "failed to delete this filling of cakes that are using this filling",
        500
      )
    );
  }

  next();
});

export const Filling = mongoose.model<IFilling>("Filling", fillingSchema);
