import { IUser, User } from "../models/User";

export class UserRepository {
  constructor() {}

  async findById(id: string): Promise<IUser | undefined> {
    const user = await User.findById({ _id: id });

    if (!user) {
      return;
    }

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async create(
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<IUser | undefined> {
    const user = await User.create({
      name: name,
      username: username,
      email: email,
      password: password
    });

    if (!user) {
      return;
    }

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
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

  async findByEmail(email: string): Promise<IUser | undefined> {
    const user = await User.findOne({ email: email });

    if (!user) {
      return;
    }

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async findByEmailWithPassword(email: string): Promise<IUser | undefined> {
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return;
    }

    return {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
