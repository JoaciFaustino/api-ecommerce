import { FilterQuery } from "mongoose";
import { IPersonalizedCake } from "../@types/Cart";
import {
  ContactDetails,
  DeliveryAddress,
  IOrder,
  OrderState,
  TypeOfReceiptOptions
} from "../@types/Order";
import {
  OrdersFiltersOption,
  OrdersSortByOption,
  sortByPossibleOptions
} from "../@types/OrdersFilters";
import { Order } from "../models/Order";
import { _FilterQuery } from "mongoose";

export class OrderRepository {
  constructor() {}

  async countDocs(
    filters: OrdersFiltersOption[],
    clientName?: string,
    userId?: string
  ): Promise<number> {
    const query = this.normalizeGetAllFilters(filters, clientName, userId);

    return await Order.countDocuments(query);
  }

  async getAll(
    limit: number,
    page: number,
    sortBy: OrdersSortByOption,
    filters: OrdersFiltersOption[],
    clientName?: string
  ): Promise<IOrder[] | undefined> {
    const sortByMongooseConfig = sortByPossibleOptions[sortBy];

    const query = this.normalizeGetAllFilters(filters, clientName);

    const orders = await Order.find(query)
      .sort(sortByMongooseConfig)
      .skip(limit * (page - 1))
      .limit(limit);

    return orders?.map((order) => ({
      _id: order._id,
      userId: order.userId,
      cakes: order.cakes,
      typeOfReceipt: order.typeOfReceipt,
      contactDetails: order.contactDetails,
      observations: order.observations,
      deliveryAddress: order.deliveryAddress,
      dateAndTimeDelivery: order.dateAndTimeDelivery,
      totalPricing: order.totalPricing,
      state: order.state,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
  }

  async getAllUserOrders(
    limit: number,
    page: number,
    userId: string
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
      state: order.state,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
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
      dateAndTimeDelivery: order.dateAndTimeDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  async update(
    id: string,
    state?: OrderState,
    dateAndTimeDelivery?: Date
  ): Promise<IOrder | undefined> {
    const order = await Order.findByIdAndUpdate(
      id,
      { state, dateAndTimeDelivery },
      { new: true }
    );

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
      dateAndTimeDelivery: order.dateAndTimeDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }

  async delete(id: string): Promise<void> {
    await Order.findByIdAndDelete(id);
  }

  private normalizeGetAllFilters(
    filters: OrdersFiltersOption[],
    clientName?: string,
    userId?: string
  ): FilterQuery<IOrder> {
    if (userId) {
      return { userId };
    }

    if (clientName) {
      return { "contactDetails.name": { $regex: clientName, $options: "i" } };
    }

    const stateFilters = filters.filter(
      (filter) =>
        filter === "done" || filter === "preparing" || filter === "pending"
    );

    const typeOfReceiptFilters = filters.filter(
      (filter) => filter === "delivery" || filter === "pick-up"
    );

    if (stateFilters.length === 0 && typeOfReceiptFilters.length === 0) {
      return {};
    }

    const orQuery: FilterQuery<IOrder>[] = [];

    if (stateFilters.length > 0) {
      orQuery.push({ state: { $in: stateFilters } });
    }

    if (typeOfReceiptFilters.length > 0) {
      orQuery.push({ typeOfReceipt: { $in: typeOfReceiptFilters } });
    }

    return { $or: orQuery };
  }
}
