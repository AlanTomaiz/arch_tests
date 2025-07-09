import { PrismaClient } from "@prisma/client";
import { UserModel } from "../../models/UserModel";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepositoryPrisma implements IUserRepository {
  constructor(private prisma = new PrismaClient()) {}

  async findByEmail(email: string): Promise<UserModel | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(user: UserModel): Promise<UserModel> {
    return this.prisma.user.create({ data: user });
  }
}
