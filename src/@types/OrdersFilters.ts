import { SortOrder } from "mongoose";
import { IOrder } from "./Order";

export const ORDERS_SORT_BY_OPTIONS = [
  "latest",
  "oldest",
  "price: highest to lowest",
  "price: lowest to highest",
  "delivery date: from future to overdue",
  "delivery date: from overdue to future"
] as const;

export type OrdersSortByOption = (typeof ORDERS_SORT_BY_OPTIONS)[number];

export type MongooseSortConfig = {
  [key in keyof Omit<Partial<IOrder>, "_id">]: SortOrder;
} & { _id: 1 };

export const sortByPossibleOptions: Record<
  OrdersSortByOption,
  MongooseSortConfig
> = {
  latest: { createdAt: -1, _id: 1 },
  oldest: { createdAt: 1, _id: 1 },
  "price: highest to lowest": { totalPricing: -1, _id: 1 },
  "price: lowest to highest": { totalPricing: 1, _id: 1 },
  "delivery date: from future to overdue": { dateAndTimeDelivery: -1, _id: 1 },
  "delivery date: from overdue to future": { dateAndTimeDelivery: 1, _id: 1 }
};

export const ORDERS_FILTERS_OPTIONS = [
  "pending",
  "done",
  "preparing",
  "delivery",
  "pick-up"
] as const;

export type OrdersFiltersOption = (typeof ORDERS_FILTERS_OPTIONS)[number];
