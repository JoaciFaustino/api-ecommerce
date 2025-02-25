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
ordersRouter.use(new AuthMiddleware().isAdmin);
ordersRouter.get("/", asyncErrorHandler(new OrderController().getAll));
ordersRouter.patch(
  "/update/:id",
  asyncErrorHandler(new OrderController().update)
);
ordersRouter.delete(
  "/delete/:id",
  asyncErrorHandler(new OrderController().delete)
);

export default ordersRouter;
