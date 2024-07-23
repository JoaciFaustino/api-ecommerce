import mongoose from "mongoose";
import { IOrder, OrderState, TypeOfReceiptOptions } from "../@types/Order";
import { SIZES_POSSIBLES_ENUM } from "../@types/Cake";

//  userId: Types.ObjectId | string;
//  cakes: {
//    cakeId: Types.ObjectId | string;
//    type: string;
//    frosting?: string;
//    fillings?: string[];
//    size: Size;
//    quantity: number;
//  }[];
//  typeOfReceipt: "pick-up" | "delivery";
//  contactDetails: ContactDetails;
//  observations: string;
//  deliveryAddress?: DeliveryAddress;
//  dateAndTimeDelivery?: Date;

function validateCakesOrder(cakes: any) {
  return Array.isArray(cakes) && cakes.length > 0;
}

const TYPE_OF_RECEIPT_OPTIONS: TypeOfReceiptOptions[] = [
  "delivery",
  "pick-up"
] as const;

const ORDER_STATE_OPTIONS: OrderState[] = [
  "pending",
  "preparing",
  "done"
] as const;

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    cakes: {
      type: [
        {
          cakeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cake",
            required: true
          },
          type: { type: String, required: true },
          frosting: { type: String, required: false },
          fillings: { type: [String], required: false, default: [] },
          size: { type: String, enum: SIZES_POSSIBLES_ENUM, required: true },
          totalPricing: { type: Number, required: true },
          quantity: { type: Number, required: true, default: 1 }
        }
      ],
      required: true,
      default: [],
      validate: [validateCakesOrder, "cakes array must have at least 1 cake"]
    },
    typeOfReceipt: {
      type: String,
      enum: TYPE_OF_RECEIPT_OPTIONS,
      required: true
    },
    contactDetails: {
      name: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true }
    },
    observations: {
      type: String,
      required: false
    },
    dateAndTimeDelivery: {
      type: Date,
      required: false
    },
    deliveryAddress: {
      type: {
        street: { type: String, required: true },
        number: { type: Number, required: true },
        neighborhood: { type: String, required: true },
        adicionalInfo: { type: String }
      },
      required: false
    },
    state: {
      type: String,
      enum: ORDER_STATE_OPTIONS,
      required: true,
      default: "pending"
    },
    totalPricing: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
