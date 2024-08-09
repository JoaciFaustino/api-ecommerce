import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { CartController } from "../controllers/cartController";

const cartRouter = Router();

//public routes

//authenticated routes
cartRouter.use(new AuthMiddleware().isAuthenticated);
cartRouter.get("/:cartId", asyncErrorHandler(new CartController().getById));
cartRouter.patch(
  "/add-cake/:cartId",
  asyncErrorHandler(new CartController().addCake)
);
cartRouter.patch(
  "/remove-cake/:cartId/:itemCartId",
  asyncErrorHandler(new CartController().removeCake)
);
cartRouter.patch(
  "/clear/:cartId",
  asyncErrorHandler(new CartController().clearCart)
);

//admin routes

export default cartRouter;
