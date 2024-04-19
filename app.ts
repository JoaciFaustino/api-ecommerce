import express from "express";
import router from "./src/routes";
import { connectDatabase } from "./src/db/db";
import { errorMiddleware } from "./src/middlewares/errorMiddleware";
import { initCloudinary } from "./src/config/cloudinary";
import cors from "cors";

const app = express();

connectDatabase();
initCloudinary();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(errorMiddleware);

export default app;
