import { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import cakesRouter from "./cakesRouter";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/cakes", cakesRouter);

export default router;
