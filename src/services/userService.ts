import { UserRepository } from "../repositories/userRepository";
import { userResponseDB } from "../@types/DBresponses";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findById(id: string): Promise<userResponseDB> {
    const user: userResponseDB = await this.userRepository.findById(id);

    return user;
  }
}
