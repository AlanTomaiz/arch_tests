import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../models/UserModel";
import { UserRegisteredProducer } from "../producers/UserRegisteredProducer";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";

export class UserService {
  constructor(
    private userRepo: IUserRepository,
    private producer: UserRegisteredProducer
  ) {}

  async register(name: string, email: string): Promise<UserModel> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new Error("Email já cadastrado");

    const newUser: UserModel = {
      id: uuidv4(),
      name,
      email,
      createdAt: new Date(),
    };

    await this.userRepo.create(newUser);
    await this.producer.publish(newUser);

    return newUser;
  }
}
