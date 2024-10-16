import { IPersonalizedCake } from "../@types/Cart";
import {
  ContactDetails,
  DeliveryAddress,
  IOrder,
  TypeOfReceiptOptions
} from "../@types/Order";
import { BaseQueryParams } from "../@types/QueryParams";
import { CakeRepository } from "../repositories/cakeRepository";
import { CartRepository } from "../repositories/cartRepository";
import { OrderRepository } from "../repositories/orderRepository";
import { ApiError } from "../utils/ApiError";
import { getPrevAndNextUrl, normalizeQueryString } from "../utils/queryString";
import { CartService } from "./cartService";

type getAllReturn = {
  orders?: IOrder[];
  maxPages: number;
  prevUrl: string | null;
  nextUrl: string | null;
};

export class OrderService {
  constructor(
    private cartService = new CartService(),
    private cakeRepository = new CakeRepository(),
    private orderRepository = new OrderRepository(),
    private cartRepository = new CartRepository()
  ) {}

  async getAllUserOrders(
    url: string,
    userId: string,
    { limit = "20", page = "1" }: BaseQueryParams
  ): Promise<getAllReturn> {
    const limitNumber = parseInt(normalizeQueryString(limit) || "") || 20;
    const pageNumber = parseInt(normalizeQueryString(page) || "") || 1;

    const quantityOrdersOnDb = await this.orderRepository.countDocs(userId);
    const maxPages =
      quantityOrdersOnDb > 0 ? Math.ceil(quantityOrdersOnDb / limitNumber) : 1;

    const orders = await this.orderRepository.getAllOrders(
      limitNumber,
      pageNumber,
      userId
    );

    const { nextUrl, prevUrl } = getPrevAndNextUrl(url, pageNumber, maxPages);

    return { orders, maxPages, nextUrl, prevUrl };
  }

  async create(
    cartId: string,
    userId: string,
    typeOfReceipt: TypeOfReceiptOptions,
    contactDetails: ContactDetails,
    deliveryAddress?: DeliveryAddress,
    observations?: string
  ): Promise<IOrder | undefined> {
    if (typeOfReceipt === "delivery" && !deliveryAddress) {
      throw new ApiError(
        "deliveryAddress is required when the type of receipt is delivery",
        400
      );
    }

    const { cart } = await this.cartService.validateUserCart(cartId, userId);

    if (cart.cakes.length === 0) {
      throw new ApiError("this cart don't have cakes to order", 400);
    }

    const orderTotalPrice = cart.cakes.reduce(
      (acm, { totalPricing }) => acm + totalPricing,
      0
    );

    try {
      await this.cartRepository.update(cartId, []);
    } catch (error: any) {
      throw new ApiError("clear the user cart failed", 500);
    }

    const order: IOrder | undefined = await this.orderRepository.create(
      userId,
      cart.cakes,
      typeOfReceipt,
      contactDetails,
      orderTotalPrice,
      "pending",
      observations,
      typeOfReceipt === "delivery" ? deliveryAddress : undefined
    );

    if (!order) {
      return;
    }

    await this.increaseTheBoughtsOfTheCakesOrder(cart.cakes);

    return order;
  }

  private async increaseTheBoughtsOfTheCakesOrder(
    cakes: IPersonalizedCake[]
  ): Promise<void> {
    const promisesUpdateBoughtsOfCakes: (() => Promise<void>)[] = cakes.map(
      ({ cakeId, quantity }) => {
        return async () => {
          await this.cakeRepository
            .increaseTheBoughtsOfTheCake(cakeId.toString(), quantity)
            .catch(() => undefined);
        };
      }
    );

    await Promise.all(promisesUpdateBoughtsOfCakes.map((promise) => promise()));
  }
}
