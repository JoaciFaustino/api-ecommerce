import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakeTypeController } from "../controllers/cakeTypeController";

const cakeTypeRouter = Router();
const cakeTypeController = new CakeTypeController();
const authMiddleware = new AuthMiddleware();

//public routes
cakeTypeRouter.get("/", asyncErrorHandler(cakeTypeController.getAll));

//admin routes
cakeTypeRouter.use(authMiddleware.isAdmin);
cakeTypeRouter.post("/", asyncErrorHandler(cakeTypeController.create));
cakeTypeRouter.patch("/:id", asyncErrorHandler(cakeTypeController.update));
cakeTypeRouter.delete("/:id", asyncErrorHandler(cakeTypeController.delete));

export default cakeTypeRouter;
