import "dotenv/config";

import { RabbitMQConsumer } from "./messaging/RabbitMQConsumer";
import { EmailService } from "./services/EmailService";

async function main() {
  const emailService = new EmailService();
  const consumer = new RabbitMQConsumer(process.env.RABBITMQ_URL!, emailService);
  await consumer.connect();
  console.log("Email service rodando...");
}

main().catch(console.error);
