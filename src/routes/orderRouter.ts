import { Router } from "express";
import { OrderController } from "../controllers/orderController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const ordersRouter = Router();
const orderController = new OrderController();
const authMiddleware = new AuthMiddleware();

//public routes

//authenticated routes
ordersRouter.use(new AuthMiddleware().isAuthenticated);
ordersRouter.get(
  "/:userId",
  asyncErrorHandler(orderController.getAllUserOrders)
);
ordersRouter.post("/create", asyncErrorHandler(orderController.create));

//admin routes
ordersRouter.use(authMiddleware.isAdmin);
ordersRouter.get("/", asyncErrorHandler(orderController.getAll));
ordersRouter.patch("/update/:id", asyncErrorHandler(orderController.update));
ordersRouter.delete("/delete/:id", asyncErrorHandler(orderController.delete));

export default ordersRouter;
