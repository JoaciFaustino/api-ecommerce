import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakeController } from "../controllers/cakeController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../config/multer";

const cakesRouter = Router();

cakesRouter.get("/", asyncErrorHandler(new CakeController().getAll));

cakesRouter.use(new AuthMiddleware().isAuthenticated);
cakesRouter.get("/:id", asyncErrorHandler(new CakeController().getById));

cakesRouter.use(new AuthMiddleware().isAdmin);
cakesRouter.post(
  "/create",
  upload.single("imageCake"),
  asyncErrorHandler(new CakeController().create)
);
cakesRouter.patch(
  "/update/:id",
  asyncErrorHandler(new CakeController().update)
);
cakesRouter.delete(
  "/delete/:id",
  asyncErrorHandler(new CakeController().delete)
);

export default cakesRouter;
