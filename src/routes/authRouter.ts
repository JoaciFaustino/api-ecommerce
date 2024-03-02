import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthController } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", asyncErrorHandler(new AuthController().signUp));

export default authRouter;
