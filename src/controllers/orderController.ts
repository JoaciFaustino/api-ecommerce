import { Request, Response } from "express";
import { TYPE_OF_RECEIPT_OPTIONS } from "../@types/Order";
import {
  ReqBodyCreateOrder,
  TokenDecodedByAuthMiddleware
} from "../@types/ReqBody";
import { z } from "zod";
import mongoose from "mongoose";
import { errorEnum, errorString } from "../utils/zod";
import { phoneNumberValidator } from "../utils/regexValidators";
import { ApiError } from "../utils/ApiError";
import { OrderService } from "../services/OrderService";
import { BaseQueryParams } from "../@types/QueryParams";

export class OrderController {
  constructor() {}

  async getAllUserOrders(
    req: Request<
      { userId?: string },
      {},
      TokenDecodedByAuthMiddleware,
      BaseQueryParams
    >,
    res: Response
  ) {
    const userId = req.params.userId;
    const tokenUserId = req.body.decodedUserId;

    if (userId !== tokenUserId) {
      throw new ApiError("unauthorized", 401);
    }

    if (!userId || typeof userId !== "string") {
      throw new ApiError("user id is invalid", 400);
    }

    const url = req.protocol + "://" + req.get("host") + req.originalUrl;
    const orderService = new OrderService();

    const { orders, maxPages, nextUrl, prevUrl } =
      await orderService.getAllUserOrders(url, userId, req.query);

    res.status(200).send({ orders, maxPages, nextUrl, prevUrl });
  }

  async create(req: Request<{}, {}, ReqBodyCreateOrder>, res: Response) {
    const deliveryAdressValidation = z.object({
      street: z.string({ message: errorString("street", true) }).trim(),
      number: z.string({ message: errorString("number", true) }),
      neighborhood: z.string({ message: errorString("neighborhood", true) }),
      adicionalInfo: z
        .string({ message: errorString("adicionalInfo", true) })
        .optional()
    });

    const contactDetailsValidation = z.object({
      name: z.string({ message: errorString("name", true) }).trim(),
      phoneNumber: z
        .string({ message: errorString("phone Number", true) })
        .trim()
        .refine((value) => phoneNumberValidator(value), {
          message: "phone number is not valid"
        }),
      email: z
        .string({ message: errorString("email", true) })
        .trim()
        .email({ message: "email is not valid" })
    });

    const reqBodyValidation = z.object({
      cartId: z
        .string({ message: errorString("cartId", true) })
        .trim()
        .refine((value) => mongoose.Types.ObjectId.isValid(value), {
          message: "cartId is not valid id"
        }),
      typeOfReceipt: z.enum(TYPE_OF_RECEIPT_OPTIONS, {
        message: errorEnum("typeOfReceipt")
      }),
      observations: z
        .string({ message: errorString("observations") })
        .trim()
        .optional(),
      deliveryAddress: deliveryAdressValidation.optional(),
      contactDetails: contactDetailsValidation
    });

    try {
      const bodyValidated = reqBodyValidation.parse({
        cartId: req.body.cartId,
        typeOfReceipt: req.body.typeOfReceipt,
        observations: req.body.observations,
        contactDetails: req.body.contactDetails,
        deliveryAddress: req.body.deliveryAddress
      });

      const orderService = new OrderService();

      const { decodedUserId } = req.body;
      const {
        cartId,
        typeOfReceipt,
        contactDetails,
        deliveryAddress,
        observations
      } = bodyValidated;

      const order = await orderService.create(
        cartId,
        decodedUserId,
        typeOfReceipt,
        contactDetails,
        deliveryAddress,
        observations
      );

      if (!order) {
        throw new ApiError("failed to create the order", 500);
      }

      return res.status(200).send({ order });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new ApiError(error.errors[0].message, 400);
      }

      throw error;
    }
  }
}
