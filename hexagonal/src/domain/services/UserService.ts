import { v4 as uuidv4 } from "uuid";
import { IEmailPublisher } from "../../ports/email/IEmailPublisher";
import { User } from "../entities/User";
import { IUserRepository } from "../repositories/IUserRepository";

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private emailPublisher: IEmailPublisher
  ) {}

  async registerUser(email: string, name: string): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new Error("Usuário com esse email já cadastrado.");
    }

    const newUser: User = {
      id: uuidv4(),
      email,
      name,
      createdAt: new Date(),
    };

    await this.userRepo.create(newUser);
    await this.emailPublisher.publishUserRegistered(newUser);

    return newUser;
  }
}
