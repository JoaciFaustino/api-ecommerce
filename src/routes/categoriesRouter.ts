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
categoryRouter.patch(
  "/update/:id",
  asyncErrorHandler(new CategoryController().update)
);
categoryRouter.delete(
  "/delete/:id",
  asyncErrorHandler(new CategoryController().delete)
);

export default categoryRouter;
