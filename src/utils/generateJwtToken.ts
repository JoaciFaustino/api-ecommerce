import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateJwtToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: 86400
  });
};
