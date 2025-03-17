import { Router } from "express";
import { asyncErrorHandler } from "../middlewares/asyncErrorHandler";
import { CakeController } from "../controllers/cakeController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { upload } from "../config/multer";

const cakesRouter = Router();
const cakeController = new CakeController();
const authMiddleware = new AuthMiddleware();

//public routes
cakesRouter.get("/", asyncErrorHandler(cakeController.getAll));

//authenticated routes
cakesRouter.use(authMiddleware.isAuthenticated);
cakesRouter.get("/:id", asyncErrorHandler(cakeController.getById));

//admin routes
cakesRouter.use(authMiddleware.isAdmin);
cakesRouter.post(
  "/",
  upload.single("imageCake"),
  asyncErrorHandler(cakeController.create)
);
cakesRouter.patch(
  "/:id",
  upload.single("imageCake"),
  asyncErrorHandler(cakeController.update)
);
cakesRouter.delete("/:id", asyncErrorHandler(cakeController.delete));

export default cakesRouter;
