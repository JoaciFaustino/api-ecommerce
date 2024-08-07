import "dotenv/config";
import { UserRepository } from "../repositories/userRepository";
import { ApiError } from "../utils/ApiError";
import { generateLoginToken, verifyLoginToken } from "../utils/jwt";
import bcrypt from "bcrypt";
import { IUser } from "../models/User";
import { CartRepository } from "../repositories/cartRepository";
import { ICart } from "../@types/Cart";

export class AuthService {
  constructor(
    private userRepository = new UserRepository(),
    private cartRepository = new CartRepository()
  ) {}

  async signUp(
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const hashPassword = await bcrypt.hash(password, 10);

    const cart: ICart | undefined = await this.cartRepository.create();

    if (!cart || !cart?._id) {
      throw new ApiError("internal database error", 500);
    }

    const user: IUser | undefined = await this.userRepository
      .create(name, username, email, hashPassword, cart._id.toString())
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

    if (!user || !user._id) {
      throw new ApiError("internal database error", 500);
    }

    const token = "Bearer " + generateLoginToken(user?._id.toString(), "user");

    return {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: "user",
        cartId: cart._id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token: token
    };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
    const user: IUser | undefined =
      await this.userRepository.findByEmailWithPassword(email);

    if (!user) throw new ApiError("wrong email or password", 401);

    if (!user.password || !user._id) {
      throw new ApiError("failure in database", 500);
    }

    const isPasswordValid: boolean = bcrypt.compareSync(
      password,
      user.password
    );

    if (!isPasswordValid) throw new ApiError("wrong email or password", 401);

    const roleUser = user?.role === "admin" ? "admin" : "user";

    const token = "Bearer " + generateLoginToken(user._id.toString(), roleUser);

    return {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: roleUser,
        cartId: user.cartId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
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
