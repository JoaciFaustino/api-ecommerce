import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const ordersRouter = Router();

//public routes

//authenticated routes
ordersRouter.use(new AuthMiddleware().isAuthenticated);
ordersRouter.get(
  "/:userId",
  asyncErrorHandler(new OrderController().getAllUserOrders)
);
ordersRouter.post("/create", asyncErrorHandler(new OrderController().create));

//admin routes

export default ordersRouter;
