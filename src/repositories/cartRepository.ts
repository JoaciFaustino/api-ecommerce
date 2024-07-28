import { ICart, IPersonalizedCake } from "../@types/Cart";
import { Cart } from "../models/Cart";

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

  async addCake(cartId: string, newCakeItem: IPersonalizedCake): Promise<void> {
    await Cart.updateOne({ _id: cartId }, { $push: { cakes: newCakeItem } });
  }

  async removeCake(cartId: string, itemCartId: string): Promise<void> {
    await Cart.updateOne(
      { _id: cartId },
      { $pull: { cakes: { _id: itemCartId } } }
    );
  }

  async update(cartId: string, cakes: IPersonalizedCake[]): Promise<void> {
    await Cart.updateOne({ _id: cartId }, { cakes });
  }
}
