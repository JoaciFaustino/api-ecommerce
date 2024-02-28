import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";

const userRouter = Router();

userRouter.get(
  "/findById/:id",
  asyncErrorHandler(new UserController().findById)
);

export default userRouter;
