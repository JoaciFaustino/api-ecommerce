import { ICake, Size } from "../@types/Cake";
import { ICart } from "../@types/Cart";
import { IUser } from "../models/User";
import { CartRepository } from "../repositories/cartRepository";
import { UserRepository } from "../repositories/userRepository";
import { ApiError } from "../utils/ApiError";
import { CakeService } from "./cakeService";
import { PersonalizedCakeService } from "./personalizedCakeService";

export class CartService {
  constructor(
    private userRepository = new UserRepository(),
    private cakeService = new CakeService(),
    private cartRepository = new CartRepository(),
    private personalizedCakeService = new PersonalizedCakeService()
  ) {}

  async getById(cartId: string, userId: string): Promise<ICart | undefined> {
    await this.validateUserCart(cartId, userId);

    const cart: ICart | undefined = await this.cartRepository.getById(cartId);

    if (!cart) {
      return;
    }

    return cart;
  }

  async addCake(
    cartId: string,
    userId: string,
    cakeId: string,
    quantity: number = 1,
    type?: string,
    frosting?: string,
    fillings?: string[],
    size?: Size
  ): Promise<void> {
    await this.validateUserCart(cartId, userId);

    const cake: ICake | undefined = await this.cakeService.findById(cakeId);

    if (!cake || !cake._id) {
      throw new ApiError("this cake don't exists", 404);
    }

    const itemCartValidation =
      await this.personalizedCakeService.validateItemCart(
        cake,
        quantity,
        type,
        frosting,
        fillings,
        size
      );

    if (!itemCartValidation.isValid) {
      throw new ApiError(
        itemCartValidation.errorMessage,
        itemCartValidation.status
      );
    }

    const { data: itemCart } = itemCartValidation;

    return await this.cartRepository.addCake(cartId, itemCart);
  }

  async removeCake(
    cartId: string,
    userId: string,
    itemCartId: string
  ): Promise<void> {
    await this.validateUserCart(cartId, userId);

    await this.cartRepository.removeCake(cartId, itemCartId);
  }

  async validateUserCart(
    cartId: string,
    userId: string
  ): Promise<{ user: IUser; cart: ICart }> {
    const cart: ICart | undefined = await this.cartRepository.getById(cartId);

    if (!cart) {
      throw new ApiError("This cart doesn't exists", 404);
    }

    const user = await this.userRepository.findById(userId);

    if (user?.cartId.toString() !== cartId) {
      throw new ApiError("This cart doesn't belong to this user", 403);
    }

    return { user, cart };
  }

  async clearCart(cartId: string): Promise<void> {
    await this.cartRepository.update(cartId, []);
  }
}
