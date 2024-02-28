import { HydratedDocument } from "mongoose";
import { IUser, User } from "../models/User";
import { userResponseDB } from "../types/DBresponses";

export class UserRepository {
  constructor() {}

  async findById(id: string): Promise<userResponseDB> {
    return await User.findById({ _id: id });
  }
}
