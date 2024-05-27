import express, { Router } from "express";
import userRouter from "./userRouter";
import authRouter from "./authRouter";
import cakesRouter from "./cakesRouter";
import path from "path";
import categoryRouter from "./categoriesRouter";
import cakeTypeRouter from "./cakeTypeRouter";
import fillingRouter from "./fillingRouter";
import frostingRouter from "./frostingRouter";

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
router.use("/categories", categoryRouter);
router.use("/cakeTypes", cakeTypeRouter);
router.use("/fillings", fillingRouter);
router.use("/frostings", frostingRouter);

export default router;
