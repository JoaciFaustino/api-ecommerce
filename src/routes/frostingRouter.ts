import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { FrostingController } from "../controllers/frostingController";

const frostingRouter = Router();
const frostingController = new FrostingController();
const authMiddleware = new AuthMiddleware();

//public routes
frostingRouter.get("/", asyncErrorHandler(frostingController.getAll));

//admin routes
frostingRouter.use(authMiddleware.isAdmin);
frostingRouter.post("/create", asyncErrorHandler(frostingController.create));
frostingRouter.patch(
  "/update/:id",
  asyncErrorHandler(frostingController.update)
);
frostingRouter.delete(
  "/delete/:id",
  asyncErrorHandler(frostingController.delete)
);

export default frostingRouter;
