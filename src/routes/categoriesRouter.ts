import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CategoryController } from "../controllers/categoryController";

const categoryRouter = Router();
const categoryController = new CategoryController();
const authMiddleware = new AuthMiddleware();

//public routes
categoryRouter.get("/", asyncErrorHandler(categoryController.getAll));

//admin routes
categoryRouter.use(authMiddleware.isAdmin);
categoryRouter.post("/", asyncErrorHandler(categoryController.create));
categoryRouter.patch("/:id", asyncErrorHandler(categoryController.update));
categoryRouter.delete("/:id", asyncErrorHandler(categoryController.delete));

export default categoryRouter;
