import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { CartController } from "../controllers/cartController";

const cartRouter = Router();

//public routes

//authenticated routes
cartRouter.use(new AuthMiddleware().isAuthenticated);
cartRouter.patch(
  "/add/:cartId",
  asyncErrorHandler(new CartController().addCake)
);

//admin routes

export default cartRouter;
