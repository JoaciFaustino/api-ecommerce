import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { FillingController } from "../controllers/fillingController";

const fillingRouter = Router();

fillingRouter.use(new AuthMiddleware().isAuthenticated);
fillingRouter.get("/", asyncErrorHandler(new FillingController().getAll));

fillingRouter.use(new AuthMiddleware().isAdmin);
fillingRouter.post(
  "/create",
  asyncErrorHandler(new FillingController().create)
);

export default fillingRouter;
