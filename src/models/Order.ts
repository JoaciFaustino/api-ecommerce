import mongoose from "mongoose";
import {
  IOrder,
  ORDER_STATE_OPTIONS,
  OrderState,
  TYPE_OF_RECEIPT_OPTIONS
} from "../@types/Order";
import { SIZES_POSSIBLES_ENUM } from "../@types/Cake";

function validateCakesOrder(cakes: any) {
  return Array.isArray(cakes) && cakes.length > 0;
}

const defaultStateOption: OrderState = "pending";

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
          name: { type: String, required: true },
          type: { type: String, required: true },
          frosting: { type: String, required: false },
          fillings: { type: [String], required: false, default: [] },
          size: { type: String, enum: SIZES_POSSIBLES_ENUM, required: true },
          imageUrl: { type: String, required: true },
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
      type: {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        email: { type: String, required: true }
      },
      required: false
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
        number: { type: String, required: true },
        neighborhood: { type: String, required: true },
        adicionalInfo: { type: String }
      },
      required: false
    },
    state: {
      type: String,
      enum: ORDER_STATE_OPTIONS,
      required: true,
      default: defaultStateOption
    },
    totalPricing: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
