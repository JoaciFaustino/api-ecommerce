import { Request, Response } from "express";
import {
  ReqBodyAddItemInCart,
  TokenDecodedByAuthMiddleware
} from "../@types/ReqBody";
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

export class CartController {
  constructor() {}

  async getById(
    req: Request<{ cartId?: string }, {}, TokenDecodedByAuthMiddleware, {}>,
    res: Response
  ) {
    const cartId = req.params.cartId;
    const { decodedUserId } = req.body;

    if (!cartId) {
      throw new ApiError("the param cartId is required", 400);
    }

    const cartService = new CartService();

    const cart = await cartService.getById(cartId, decodedUserId);

    if (!cart) {
      throw new ApiError("failed to get the cart", 500);
    }

    return res.status(200).send({ cart });
  }

  async addCake(
    req: Request<{ cartId?: string }, {}, ReqBodyAddItemInCart, {}>,
    res: Response
  ) {
    const reqBodyValidation = z.object({
      cakeId: z.string({ message: errorString("cakeId", true) }).trim(),
      type: z
        .string({ message: errorString("type") })
        .trim()
        .optional(),
      frosting: z
        .string({ message: errorString("frosting") })
        .trim()
        .nullable()
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
    if (!cartId) {
      throw new ApiError("the param cartId is required", 400);
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

      const addedCake = await cartService.addCake(
        cartId,
        userId,
        cakeId,
        quantity,
        type,
        frosting,
        fillings,
        size
      );

      if (!addedCake) {
        throw new ApiError("failed to add cake in the cart", 500);
      }

      return res.status(200).send({ addedCake });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw new ApiError(error.errors[0].message, 400);
      }

      throw error;
    }
  }

  async removeCake(
    req: Request<
      { cartId?: string; itemCartId?: string },
      {},
      TokenDecodedByAuthMiddleware,
      {}
    >,
    res: Response
  ) {
    const { cartId, itemCartId } = req.params;
    const { decodedUserId } = req.body;

    if (!cartId) {
      throw new ApiError("the param cartId is required", 400);
    }

    if (!itemCartId) {
      throw new ApiError("the param itemCartId is required", 400);
    }

    const cartService = new CartService();

    await cartService.removeCake(cartId, decodedUserId, itemCartId);

    return res.status(200).send({ message: "cake removed sucessfully" });
  }

  async clearCart(
    req: Request<{ cartId?: string }, {}, TokenDecodedByAuthMiddleware, {}>,
    res: Response
  ) {
    const cartId = req.params.cartId;
    const { decodedUserId } = req.body;

    if (!cartId) {
      throw new ApiError("the param cartId is required", 400);
    }

    const cartService = new CartService();

    await cartService.clearCart(cartId, decodedUserId);

    return res.status(200).send({ message: "cart cleared sucessfully" });
  }
}
