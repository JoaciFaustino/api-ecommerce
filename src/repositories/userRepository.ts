import { User } from "../models/User";
import { userResponseDB } from "../@types/DBresponses";

export class UserRepository {
  constructor() {}

  async findById(id: string): Promise<userResponseDB> {
    return await User.findById({ _id: id });
  }

  async create(
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<userResponseDB> {
    return await User.create({
      name: name,
      username: username,
      email: email,
      password: password
    });
  }

  async userAlreadyExists(
    name: string,
    username: string,
    email: string
  ): Promise<boolean> {
    return await !!User.findOne({
      $or: [{ name: name }, { username: username }, { email: email }]
    });
  }

  async findByEmail(email: string) {
    return await User.findOne({ email: email });
  }

  async findByEmailWithPassword(email: string) {
    return await User.findOne({ email: email }).select("+password");
  }
}
