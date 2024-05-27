import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CategoryController } from "../controllers/categoryController";

const categoryRouter = Router();

categoryRouter.use(new AuthMiddleware().isAuthenticated);
categoryRouter.get("/", asyncErrorHandler(new CategoryController().getAll));

categoryRouter.use(new AuthMiddleware().isAdmin);
categoryRouter.post(
  "/create",
  asyncErrorHandler(new CategoryController().create)
);

export default categoryRouter;
