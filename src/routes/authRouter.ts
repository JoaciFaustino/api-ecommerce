import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthController } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", asyncErrorHandler(new AuthController().signUp));
authRouter.post("/login", asyncErrorHandler(new AuthController().login));

export default authRouter;
