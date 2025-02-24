import { Types } from "mongoose";
import { IPersonalizedCake } from "./Cart";

export const TYPE_OF_RECEIPT_OPTIONS = ["delivery", "pick-up"] as const;

export type TypeOfReceiptOptions = (typeof TYPE_OF_RECEIPT_OPTIONS)[number];

export const ORDER_STATE_OPTIONS = ["pending", "preparing", "done"] as const;

export type OrderState = (typeof ORDER_STATE_OPTIONS)[number];

export interface DeliveryAddress {
  street: string;
  number: string; //vai ser string por que existem casas (pelo menos no Brasil) com número com esse formato "A123", "B123"
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
  deliveryAddress?: DeliveryAddress; //it will be undefined when the typeOfReceipt is "pick-up"

  dateAndTimeDelivery?: Date; //it will be undefined when the typeOfReceipt is "pick-up"
  totalPricing: number;
  state: OrderState;

  createdAt?: Date;
  updatedAt?: Date;
}
