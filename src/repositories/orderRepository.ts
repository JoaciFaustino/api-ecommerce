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

  async countDocs(userId?: string): Promise<number> {
    return await Order.countDocuments({ userId });
  }

  async getAllOrders(
    limit: number,
    page: number,
    userId?: string
  ): Promise<IOrder[] | undefined> {
    const orders = await Order.find({ userId })
      .skip(limit * (page - 1))
      .limit(limit);

    if (!orders) {
      return;
    }

    return orders.map((order) => ({
      _id: order._id,
      userId: order.userId,
      cakes: order.cakes,
      typeOfReceipt: order.typeOfReceipt,
      contactDetails: order.contactDetails,
      observations: order.observations,
      deliveryAddress: order.deliveryAddress,
      dateAndTimeDelivery: order.dateAndTimeDelivery,
      totalPricing: order.totalPricing,
      state: order.state
    }));
  }

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
