import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

//public routes
authRouter.post("/signup", asyncErrorHandler(new AuthController().signUp));
authRouter.post("/login", asyncErrorHandler(new AuthController().login));

//authenticated routes
authRouter.use(new AuthMiddleware().isAuthenticated);
authRouter.get("/", new AuthController().auth);

export default authRouter;
