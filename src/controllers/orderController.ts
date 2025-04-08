import { Request, Response } from "express";
import { ORDER_STATE_OPTIONS, TYPE_OF_RECEIPT_OPTIONS } from "../@types/Order";
import {
  ReqBodyCreateOrder,
  ReqBodyUpdateOrder,
  TokenDecodedByAuthMiddleware
} from "../@types/ReqBody";
import { z } from "zod";
import mongoose from "mongoose";
import { errorEnum, errorString } from "../utils/zod";
import { phoneNumberValidator } from "../utils/regexValidators";
import { ApiError } from "../utils/ApiError";
import { OrderService } from "../services/OrderService";
import {
  BaseQueryParams,
  IQueryParamsGetAllOrders
} from "../@types/QueryParams";
import "dotenv/config";
import { getApiUrl } from "../utils/getApiUrl";

export class OrderController {
  constructor() {}

  async getAll(
    req: Request<{}, {}, {}, IQueryParamsGetAllOrders>,
    res: Response
  ) {
    const query = req.query;

    const url = getApiUrl() + req.originalUrl.replace(/^\/api/, "");

    const orderService = new OrderService();

    const { maxPages, nextUrl, prevUrl, orders } = await orderService.getAll(
      url,
      query
    );

    return res.status(200).send({ orders, maxPages, nextUrl, prevUrl });
  }

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

    const url = getApiUrl() + req.originalUrl.replace(/^\/api/, "");
    const orderService = new OrderService();

    const { orders, maxPages, nextUrl, prevUrl } =
      await orderService.getAllUserOrders(url, userId, req.query);

    return res.status(200).send({ orders, maxPages, nextUrl, prevUrl });
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

      return res.status(201).send({ order });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new ApiError(error.errors[0].message, 400);
      }

      throw error;
    }
  }

  async update(
    req: Request<{ id?: string }, {}, ReqBodyUpdateOrder, {}>,
    res: Response
  ) {
    const orderId = req.params.id;
    const body = req.body;

    if (!orderId || typeof orderId !== "string") {
      throw new ApiError("id is required", 400);
    }

    const schema = z
      .object({
        state: z
          .enum(ORDER_STATE_OPTIONS, { message: errorEnum("state") })
          .optional(),
        dateAndTimeDelivery: z
          .string({ message: "dateAndTimeDelivery must be a ISOSstring" })
          .datetime({ message: "dateAndTimeDelivery must be a ISOSstring" })
          .optional()
          .refine((dateString) => {
            const deliveryDate = new Date(dateString || "invalid value");

            return !dateString || deliveryDate > new Date();
          }, "that date has already passed")
          .refine((dateString) => {
            const deliveryDate = new Date(dateString || "invalid value");

            const oneYearFromToday = new Date();
            oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);

            return !dateString || deliveryDate < oneYearFromToday;
          }, "that date is too far away")
      })
      .refine(
        ({ state, dateAndTimeDelivery }) => state || dateAndTimeDelivery,
        { message: "send some field to update" }
      );

    try {
      const { dateAndTimeDelivery, state } = schema.parse(body);

      const dateDeliveryNormalized = dateAndTimeDelivery
        ? new Date(dateAndTimeDelivery)
        : undefined;

      const orderService = new OrderService();

      const updatedOrder = await orderService.update(
        orderId,
        state,
        dateDeliveryNormalized
      );

      if (!updatedOrder) {
        throw new ApiError("failed to update the order", 500);
      }

      return res.status(200).send({
        message: "order was updated successfully",
        order: updatedOrder
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new ApiError(error.errors[0].message, 400);
      }

      throw error;
    }
  }

  async delete(req: Request<{ id?: string }, {}, {}, {}>, res: Response) {
    const orderId = req.params.id;

    if (!orderId || typeof orderId !== "string") {
      throw new ApiError("id is required", 400);
    }

    const orderService = new OrderService();

    try {
      await orderService.delete(orderId);
    } catch (error) {
      throw new ApiError("Failed to delete the order", 400);
    }

    return res.status(200).send({ message: "order deleted successfully" });
  }
}
