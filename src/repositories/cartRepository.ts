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
  ): Promise<void> {
    const responseInfoDB = await Cart.updateOne(
      { _id: cartId },
      { $push: { cakes: newPersonalizedCake } }
    );

    if (responseInfoDB.modifiedCount === 0) {
      throw new ApiError("this cart doesn't exists", 400);
    }
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
