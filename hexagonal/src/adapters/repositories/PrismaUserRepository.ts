import { PrismaClient } from "@prisma/client";
import type { User } from "../../domain/entities/User";
import type { IUserRepository } from "../../domain/repositories/IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? { ...user } : null;
  }

  async create(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}
