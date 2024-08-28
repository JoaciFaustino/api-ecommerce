import mongoose from "mongoose";
import { ICart, IPersonalizedCake } from "../@types/Cart";
import { Cart } from "../models/Cart";
import { ApiError } from "../utils/ApiError";

export class CartRepository {
  constructor() {}

  async getById(id: string): Promise<ICart | undefined> {
    const cart = await Cart.findById(id);

    if (!cart) {
      return;
    }

    return { _id: cart._id, cakes: cart.cakes };
  }

  async create(): Promise<ICart | undefined> {
    const cart = await Cart.create({ cakes: [] });

    if (!cart) {
      return;
    }

    return { _id: cart._id, cakes: cart.cakes };
  }

  async addCake(
    cartId: string,
    newPersonalizedCake: IPersonalizedCake
  ): Promise<IPersonalizedCake | undefined> {
    const newCakeId = new mongoose.Types.ObjectId();

    const cart = await Cart.findOneAndUpdate(
      { _id: cartId },
      { $push: { cakes: { _id: newCakeId, ...newPersonalizedCake } } },
      { new: true }
    );

    if (!cart) {
      return;
    }

    const addedPersonalizedCake = cart.cakes.filter(
      ({ _id }) =>
        (typeof _id !== "string" && _id?.equals(newCakeId)) ||
        _id === newCakeId.toString()
    )[0];

    return addedPersonalizedCake;
  }

  async removeCake(cartId: string, personalizedCakeId: string): Promise<void> {
    const responseInfoDB = await Cart.updateOne(
      { _id: cartId, "cakes._id": personalizedCakeId },
      { $pull: { cakes: { _id: personalizedCakeId } } }
    );

    if (responseInfoDB.modifiedCount === 0) {
      throw new ApiError(
        "this cart doesn't exists or this personalized cake doesn't exists in this cart",
        400
      );
    }
  }

  async update(cartId: string, cakes: IPersonalizedCake[]): Promise<void> {
    await Cart.updateOne({ _id: cartId }, { cakes });
  }
}
