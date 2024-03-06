import jwt from "jsonwebtoken";
import "dotenv/config";

type jwtDecodedType = {
  id: string;
  role: string;
  iat: number;
  exp: number;
};

export const generateLoginToken = (userId: string, role: string) => {
  const oneDay = 86400;

  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET as string,
    { expiresIn: oneDay }
  );
};

export const verifyLoginToken = (
  token: string
): { userId: string; role: string } => {
  try {
    const jwtDecoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwtDecodedType;

    if (jwtDecoded.id && jwtDecoded.role) {
      const userId = jwtDecoded.id as string;
      const role = jwtDecoded.role as string;

      return { userId, role };
    } else {
      return { userId: "", role: "" };
    }
  } catch (error: any) {
    return { userId: "", role: "" };
  }
};
