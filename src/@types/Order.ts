import { Types } from "mongoose";
import { IPersonalizedCake } from "./Cart";

export type TypeOfReceiptOptions = "pick-up" | "delivery";

export type OrderState = "pending" | "done" | "preparing";

export interface DeliveryAddress {
  street: string;
  number: number;
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
}
