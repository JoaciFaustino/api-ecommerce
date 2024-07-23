import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { FrostingController } from "../controllers/frostingController";

const frostingRouter = Router();

//public routes
frostingRouter.get("/", asyncErrorHandler(new FrostingController().getAll));

//admin routes
frostingRouter.use(new AuthMiddleware().isAdmin);
frostingRouter.post(
  "/create",
  asyncErrorHandler(new FrostingController().create)
);

export default frostingRouter;
