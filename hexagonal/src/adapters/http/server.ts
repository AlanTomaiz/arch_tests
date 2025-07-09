import "dotenv/config";

import { UserController } from "@adapters/controllers/UserController";
import { RabbitMQPublisher } from "@adapters/messaging/RabbitMQPublisher";
import { PrismaUserRepository } from "@adapters/repositories/PrismaUserRepository";
import { UserService } from "@domain/services/UserService";
import { PrismaClient } from "@prisma/client";
import express from "express";

async function main() {
  const app = express();
  app.use(express.json());

  const prisma = new PrismaClient();
  const userRepo = new PrismaUserRepository(prisma);

  const rabbitMQUrl = String(process.env.RABBITMQ_URL);
  const emailPublisher = new RabbitMQPublisher(rabbitMQUrl);
  await emailPublisher.connect();

  const userService = new UserService(userRepo, emailPublisher);
  const userController = new UserController(userService);

  app.post("/users", userController.registerUser);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`User service listening on port ${port}`);
  });
}

main().catch(console.error);
