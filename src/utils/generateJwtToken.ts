import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateLoginToken = (userId: string, role: string) => {
  const oneDay = 86400;

  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET as string,
    { expiresIn: oneDay }
  );
};
