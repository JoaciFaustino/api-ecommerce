import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CategoryController } from "../controllers/categoryController";

const categoryRouter = Router();

//public routes
categoryRouter.get("/", asyncErrorHandler(new CategoryController().getAll));

//admin routes
categoryRouter.use(new AuthMiddleware().isAdmin);
categoryRouter.post(
  "/create",
  asyncErrorHandler(new CategoryController().create)
);

export default categoryRouter;
