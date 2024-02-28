import express from "express";
import router from "./src/routes";
import { connectDatabase } from "./src/db/db";
import { errorMiddleware } from "./src/middlewares/errorMiddleware";

const app = express();

connectDatabase();

app.use(express.json());
app.use("/api", router);
app.use(errorMiddleware);

export default app;
