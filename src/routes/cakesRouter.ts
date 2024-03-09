import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakeController } from "../controllers/cakeController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const cakesRouter = Router();

cakesRouter.use(new AuthMiddleware().isAuthenticated);
cakesRouter.get("/:id", asyncErrorHandler(new CakeController().getById));

cakesRouter.use(new AuthMiddleware().isAdmin);
cakesRouter.post("/create", asyncErrorHandler(new CakeController().create));
cakesRouter.patch(
  "/update/:id",
  asyncErrorHandler(new CakeController().update)
);

export default cakesRouter;
