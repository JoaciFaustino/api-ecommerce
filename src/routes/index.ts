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

//temporary code
//middleware to simulate delay in the request just for tests in front end
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
router.use(
  asyncErrorHandler(async (req, res, next) => {
    const delay = Math.floor(Math.random() * 7) + 1;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve("");
      }, delay * 1000);
    });

    next();
  })
);

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
