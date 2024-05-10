import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { AuthController } from "../controllers/authController";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

authRouter.get(
  "/",
  new AuthMiddleware().isAuthenticated,
  new AuthController().auth
);
authRouter.post("/signup", asyncErrorHandler(new AuthController().signUp));
authRouter.post("/login", asyncErrorHandler(new AuthController().login));

export default authRouter;
