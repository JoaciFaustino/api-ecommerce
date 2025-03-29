import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import "dotenv/config";
import { getApiUrl } from "../utils/getApiUrl";

const swaggerRoute = Router();

const apiUrl = getApiUrl();

swaggerDocument.servers = [{ url: apiUrl, description: "API url" }] as any;

swaggerRoute.use(swaggerUi.serve);
swaggerRoute.get("/", swaggerUi.setup(swaggerDocument));

export default swaggerRoute;
