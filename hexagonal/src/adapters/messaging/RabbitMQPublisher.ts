import amqp from "amqplib";
import type { User } from "../../domain/entities/User";
import type { IEmailPublisher } from "../../ports/email/IEmailPublisher";

export class RabbitMQPublisher implements IEmailPublisher {
  private channel?: amqp.Channel;
  private readonly queueName = "user.registered";

  constructor(private url: string) {}

  async connect() {
    const connection = await amqp.connect(this.url);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });
  }

  async publishUserRegistered(user: User): Promise<void> {
    if (!this.channel) throw new Error("RabbitMQ channel não inicializado");
    const msg = Buffer.from(JSON.stringify(user));
    this.channel.sendToQueue(this.queueName, msg, { persistent: true });
  }
}
