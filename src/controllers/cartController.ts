import { Request, Response } from "express";
import { ReqBodyCreateCart } from "../@types/ReqBody";
import { ReqParamsAddToCart } from "../@types/ReqParams";
import { ApiError } from "../utils/ApiError";
import { z } from "zod";
import {
  errorArrayString,
  errorEnum,
  errorNumberPositive,
  errorString
} from "../utils/zod";
import { SIZES_POSSIBLES_ENUM } from "../@types/Cake";
import { CartService } from "../services/cartService";
import { ICart } from "../@types/Cart";
import mongoose from "mongoose";

export class CartController {
  constructor() {}

  async addCake(
    req: Request<ReqParamsAddToCart, {}, ReqBodyCreateCart, {}>,
    res: Response
  ) {
    const reqBodyValidation = z.object({
      cakeId: z
        .string({ message: errorString("cakeId", true) })
        .trim()
        .refine((value) => mongoose.Types.ObjectId.isValid(value)),
      type: z
        .string({ message: errorString("type") })
        .trim()
        .optional(),
      frosting: z
        .string({ message: errorString("frosting") })
        .trim()
        .optional(),
      fillings: z
        .array(z.string({ message: errorString("fillings") }).trim(), {
          message: errorArrayString("fillings")
        })
        .optional(),
      size: z
        .enum(SIZES_POSSIBLES_ENUM, { message: errorEnum("size") })
        .optional(),
      quantity: z
        .number({ message: errorNumberPositive("quantity") })
        .min(0, { message: errorNumberPositive("quantity") })
        .optional()
    });

    const { cartId } = req.params;
    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
      throw new ApiError("param cartId is not valid", 400);
    }

    try {
      const bodyValidated = reqBodyValidation.parse({
        cakeId: req.body.cakeId,
        type: req.body.type,
        frosting: req.body.frosting,
        fillings: req.body.fillings,
        size: req.body.size,
        quantity: req.body.quantity
      });

      const { decodedUserId: userId } = req.body;

      const { cakeId, fillings, frosting, quantity, size, type } =
        bodyValidated;

      const cartService = new CartService();

      const newCart: ICart | undefined = await cartService.addCake(
        cartId,
        userId,
        cakeId,
        quantity,
        type,
        frosting,
        fillings,
        size
      );

      if (!newCart) {
        throw new ApiError("failed to add item to cart", 500)
      } 
      
      return res.status(200).send({ newCart: newCart });
    } catch (error: any) {
      if (error instanceof z.ZodError)
        throw new ApiError(error.errors[0].message, 400);

      throw error;
    }
  }
}
