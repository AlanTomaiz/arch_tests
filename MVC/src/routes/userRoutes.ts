import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserRegisteredProducer } from "../producers/UserRegisteredProducer";
import { UserRepositoryPrisma } from "../repositories/implementations/UserRepositoryPrisma";
import { UserService } from "../services/UserService";

const router = Router();

const producer = new UserRegisteredProducer(process.env.RABBITMQ_URL!);
await producer.connect();

const userRepo = new UserRepositoryPrisma();
const service = new UserService(userRepo, producer);
const controller = new UserController(service);

router.post("/users", controller.register);

export default router;
