import { Router } from "express";
import { UserController } from "../controllers/userController";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";

const userRouter = Router();

userRouter.get("/findById/:id", (req, res) => console.log("hello world!"));

export default userRouter;
