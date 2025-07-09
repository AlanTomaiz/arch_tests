import { User } from "@domain/entities/User";
import { IEmailPublisher } from "@ports/email/IEmailPublisher";
import amqp from "amqplib";

export class RabbitMQPublisher implements IEmailPublisher {
  private channel?: amqp.Channel;
  private readonly queueName = "user.registered";
  private readonly retryInterval = 500; // 500ms

  constructor(private url: string) {}

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async connect() {
    while(true) {
      try {
        const connection = await amqp.connect(this.url);
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(this.queueName, { durable: true });
        console.log(`[RabbitMQPublisher] Conectado e fila "${this.queueName}" pronta.`);
        break;
      } catch (error: any) {
        console.error(`[RabbitMQPublisher] Falha ao conectar: ${error.message}`);
        console.log(`[RabbitMQPublisher] Tentando novamente em ${this.retryInterval}ms...`);
        await this.delay(this.retryInterval);
      }
    }
  }

  async publishUserRegistered(user: User): Promise<void> {
    if (!this.channel) throw new Error("RabbitMQ channel não inicializado");
    const msg = Buffer.from(JSON.stringify(user));
    this.channel.sendToQueue(this.queueName, msg, { persistent: true });
  }
}
