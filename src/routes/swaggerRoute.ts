import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import "dotenv/config";

const swaggerRoute = Router();

//depois lembrar de fazer uma modificação no .env para deixar uma variavel unica para pegar a url toda de uma vez
const apiUrl =
  `${process.env.API_PROTOCOL}://` +
  process.env.API_HOST +
  `${process.env.PORT ? ":" + process.env.PORT : ""}/api`;

swaggerDocument.servers = [{ url: apiUrl, description: "API url" }] as any;

swaggerRoute.use(swaggerUi.serve);
swaggerRoute.get("/", swaggerUi.setup(swaggerDocument));

export default swaggerRoute;
