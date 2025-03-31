import { Types } from "mongoose";
import { IPersonalizedCake } from "./Cart";

export const TYPE_OF_RECEIPT_OPTIONS = ["delivery", "pick-up"] as const;

export type TypeOfReceiptOptions = (typeof TYPE_OF_RECEIPT_OPTIONS)[number];

export const ORDER_STATE_OPTIONS = ["pending", "preparing", "done"] as const;

export type OrderState = (typeof ORDER_STATE_OPTIONS)[number];

export interface DeliveryAddress {
  street: string;
  number: string;
  neighborhood: string;
  adicionalInfo?: string;
}

export interface ContactDetails {
  name: string;
  phoneNumber: string;
  email: string;
}

export interface IOrder {
  _id?: Types.ObjectId | string;
  userId: Types.ObjectId | string;

  cakes: IPersonalizedCake[];
  typeOfReceipt: TypeOfReceiptOptions;
  contactDetails: ContactDetails;
  observations?: string;
  deliveryAddress?: DeliveryAddress;

  dateAndTimeDelivery?: Date;
  totalPricing: number;
  state: OrderState;

  createdAt?: Date;
  updatedAt?: Date;
}
