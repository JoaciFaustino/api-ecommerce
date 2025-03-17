import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { CartController } from "../controllers/cartController";

const cartRouter = Router();
const cartController = new CartController();
const authMiddleware = new AuthMiddleware();

//public routes

//authenticated routes
cartRouter.use(authMiddleware.isAuthenticated);
cartRouter.get("/:cartId", asyncErrorHandler(cartController.getById));
cartRouter.post("/:cartId/items", asyncErrorHandler(cartController.addCake));
cartRouter.delete(
  "/:cartId/items/:itemCartId",
  asyncErrorHandler(cartController.removeCake)
);
cartRouter.delete(
  "/:cartId/items",
  asyncErrorHandler(cartController.clearCart)
);

//admin routes

export default cartRouter;
