import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakesController } from "../controllers/cakesController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const cakesRouter = Router();

cakesRouter.get(
  "/:id",
  new AuthMiddleware().isAuthenticated,
  asyncErrorHandler(new CakesController().getById)
);

export default cakesRouter;
