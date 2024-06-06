import "dotenv/config";
import { UserResponseDB } from "../@types/DBresponses";
import { UserRepository } from "../repositories/userRepository";
import { ApiError } from "../utils/ApiError";
import { generateLoginToken, verifyLoginToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { IUser } from "../models/User";

export class AuthService {
  constructor(private userRepository = new UserRepository()) {}

  async signUp(
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const hashPassword = await bcrypt.hash(password, 10);

    const user: UserResponseDB = await this.userRepository
      .create(name, username, email, hashPassword)
      .catch((error: any) => {
        if (error.keyValue) {
          if (error.keyValue.name)
            throw new ApiError("this name already exists", 409);

          if (error.keyValue.username)
            throw new ApiError("this username already exists", 409);

          if (error.keyValue.email)
            throw new ApiError("this email already exists", 409);
        }
        throw error;
      });

    if (!user) throw new ApiError("failure to create user", 500);

    const token = "Bearer " + generateLoginToken(user?._id as string, "user");

    return {
      user: {
        _id: user?._id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        role: "user",
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt
      },
      token: token
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user: UserResponseDB =
      await this.userRepository.findByEmailWithPassword(email);

    if (!user) throw new ApiError("wrong email or password", 401);

    const isPasswordValid: boolean = bcrypt.compareSync(
      password,
      user?.password as string
    );

    if (!isPasswordValid) throw new ApiError("wrong email or password", 401);

    const roleUser = user?.role === "admin" ? "admin" : "user";

    const token = "Bearer " + generateLoginToken(user?._id as string, roleUser);

    return {
      user: {
        _id: user?._id,
        name: user?.name,
        username: user?.username,
        email: user?.email,
        role: roleUser,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt
      },
      token: token
    };
  }

  auth(headerAuth: string): { userId: string; role: string } {
    const [bearer, token] = headerAuth?.split(" ");

    if (
      headerAuth?.split(" ").length !== 2 ||
      !bearer ||
      !token ||
      bearer !== "Bearer"
    ) {
      return { userId: "", role: "" };
    }

    return verifyLoginToken(token);
  }
}
