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
cartRouter.patch(
  "/add-cake/:cartId",
  asyncErrorHandler(cartController.addCake)
);
cartRouter.patch(
  "/remove-cake/:cartId/:itemCartId",
  asyncErrorHandler(cartController.removeCake)
);
cartRouter.patch("/clear/:cartId", asyncErrorHandler(cartController.clearCart));

//admin routes

export default cartRouter;
