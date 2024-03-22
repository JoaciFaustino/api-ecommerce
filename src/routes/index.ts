import express, { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import cakesRouter from "./cakesRouter";
import path from "path";

const router = Router();

router.use(
  "/images",
  express.static(
    path.resolve(__dirname, "..", "..", "public", "temp", "uploads")
  )
);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/cakes", cakesRouter);

export default router;
