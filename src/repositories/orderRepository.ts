import { IPersonalizedCake } from "../@types/Cart";
import {
  ContactDetails,
  DeliveryAddress,
  IOrder,
  OrderState,
  TypeOfReceiptOptions
} from "../@types/Order";
import { Order } from "../models/Order";

export class OrderRepository {
  constructor() {}

  async create(
    userId: string,
    cakes: IPersonalizedCake[],
    typeOfReceipt: TypeOfReceiptOptions,
    contactDetails: ContactDetails,
    totalPricing: number,
    state: OrderState = "pending",
    observations?: string,
    deliveryAddress?: DeliveryAddress
  ): Promise<IOrder | undefined> {
    const order = await Order.create({
      userId,
      cakes,
      typeOfReceipt,
      contactDetails,
      totalPricing,
      state,
      deliveryAddress,
      observations
    });

    if (!order) {
      return;
    }

    return {
      _id: order._id,
      userId: order.userId,
      cakes: order.cakes,
      typeOfReceipt: order.typeOfReceipt,
      contactDetails: order.contactDetails,
      totalPricing: order.totalPricing,
      state: order.state,
      deliveryAddress: order.deliveryAddress,
      observations: order.observations,
      dateAndTimeDelivery: order.dateAndTimeDelivery
    };
  }
}
