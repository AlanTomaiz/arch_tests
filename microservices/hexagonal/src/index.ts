import "dotenv/config";

import { RabbitMQConsumer } from "./messaging/RabbitMQConsumer";
import { EmailService } from "./services/EmailService";

async function main() {
  const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
  const emailService = new EmailService();
  const consumer = new RabbitMQConsumer(rabbitMQUrl, emailService);
  await consumer.connect();
  console.log("Email service rodando...");
}

main().catch(console.error);
