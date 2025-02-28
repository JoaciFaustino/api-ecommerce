import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const userRouter = Router();
const userController = new UserController();
const authMiddleware = new AuthMiddleware();

//authenticated routes
userRouter.use(authMiddleware.isAuthenticated);
userRouter.get("/:id", asyncErrorHandler(userController.findById));

export default userRouter;
