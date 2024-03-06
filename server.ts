import app from "./app";
import "dotenv/config";

const port = process.env.PORT || 3001;

if (!process.env.JWT_SECRET) {
  console.log(
    "Please, put a JWT_SECRET in the .env file. If the .env file hasn't been created yet, you should create it. See the .env-example file. )"
  );
}
app.listen(port, () => console.log("server is running on port: " + port));
