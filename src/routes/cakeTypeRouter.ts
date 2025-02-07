import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakeTypeController } from "../controllers/cakeTypeController";

const cakeTypeRouter = Router();

//public routes
cakeTypeRouter.get("/", asyncErrorHandler(new CakeTypeController().getAll));

//admin routes
cakeTypeRouter.use(new AuthMiddleware().isAdmin);
cakeTypeRouter.post(
  "/create",
  asyncErrorHandler(new CakeTypeController().create)
);
cakeTypeRouter.patch(
  "/update/:id",
  asyncErrorHandler(new CakeTypeController().update)
);

export default cakeTypeRouter;
