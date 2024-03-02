import mongoose from "mongoose";

export const objectIdIsValid = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
