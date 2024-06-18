import { IUser } from "../models/User";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findById(id: string): Promise<IUser | undefined> {
    return await this.userRepository.findById(id);
  }
}
