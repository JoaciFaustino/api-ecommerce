import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

//authenticated routes
userRouter.use(new AuthMiddleware().isAuthenticated);
userRouter.get(
  "/:id",
  asyncErrorHandler(new UserController().findById)
);

export default userRouter;
