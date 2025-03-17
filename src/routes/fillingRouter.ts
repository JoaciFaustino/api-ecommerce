import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { FillingController } from "../controllers/fillingController";

const fillingRouter = Router();
const fillingController = new FillingController();
const authMiddleware = new AuthMiddleware();

//public routes
fillingRouter.get("/", asyncErrorHandler(fillingController.getAll));

//admin routes
fillingRouter.use(authMiddleware.isAdmin);
fillingRouter.post("/", asyncErrorHandler(fillingController.create));
fillingRouter.patch("/:id", asyncErrorHandler(fillingController.update));
fillingRouter.delete("/:id", asyncErrorHandler(fillingController.delete));

export default fillingRouter;
