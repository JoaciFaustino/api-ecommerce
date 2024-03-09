import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakeController } from "../controllers/cakeController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const cakesRouter = Router();

cakesRouter.get(
  "/:id",
  new AuthMiddleware().isAuthenticated,
  asyncErrorHandler(new CakeController().getById)
);

cakesRouter.post(
  "/create",
  new AuthMiddleware().isAdmin,
  asyncErrorHandler(new CakeController().create)
);

export default cakesRouter;
