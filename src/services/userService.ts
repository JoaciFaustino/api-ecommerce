import { UserRepository } from "../repositories/userRepository";
import { UserResponseDB } from "../@types/DBresponses";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findById(id: string): Promise<UserResponseDB> {
    return await this.userRepository.findById(id);
  }
}
