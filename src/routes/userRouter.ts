import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();

userRouter.use(new AuthMiddleware().isAuthenticated);
userRouter.get(
  "/findById/:id",
  asyncErrorHandler(new UserController().findById)
);

export default userRouter;
