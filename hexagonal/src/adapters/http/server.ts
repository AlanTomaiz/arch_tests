import { PrismaClient } from "@prisma/client";
import express from "express";
import { UserService } from "../../domain/services/UserService";
import { UserController } from "../controllers/UserController";
import { RabbitMQPublisher } from "../messaging/RabbitMQPublisher";
import { PrismaUserRepository } from "../repositories/PrismaUserRepository";

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
