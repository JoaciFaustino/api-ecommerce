import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { FillingController } from "../controllers/fillingController";

const fillingRouter = Router();

//public routes
fillingRouter.get("/", asyncErrorHandler(new FillingController().getAll));

//admin routes
fillingRouter.use(new AuthMiddleware().isAdmin);
fillingRouter.post(
  "/create",
  asyncErrorHandler(new FillingController().create)
);
fillingRouter.patch(
  "/update/:id",
  asyncErrorHandler(new FillingController().update)
);
fillingRouter.delete(
  "/delete/:id",
  asyncErrorHandler(new FillingController().delete)
);

export default fillingRouter;
