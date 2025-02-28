import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

//public routes
authRouter.post("/signup", asyncErrorHandler(authController.signUp));
authRouter.post("/login", asyncErrorHandler(authController.login));

//authenticated routes
authRouter.use(authMiddleware.isAuthenticated);
authRouter.get("/", authController.auth);

export default authRouter;
