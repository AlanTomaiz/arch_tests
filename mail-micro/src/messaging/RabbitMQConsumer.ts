import amqp from "amqplib";
import { EmailService } from "../services/EmailService";

export class RabbitMQConsumer {
  private channel!: amqp.Channel;
  private readonly queueName = "user.registered";
  private readonly retryInterval = 5 * 1000; // 5s

  constructor(private url: string, private emailService: EmailService) {}

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async connect() {
    while(true) {
      try {
        const connection = await amqp.connect(this.url);
        this.channel = await connection.createChannel();
        await this.channel.assertQueue(this.queueName, { durable: true });

        this.startConsuming();
        break;
      } catch (error: any) {
        await this.delay(this.retryInterval);
      }
    }
  }

  async startConsuming() {
    this.channel.consume(
      this.queueName,
      async (msg: amqp.ConsumeMessage | null) => {
        if (!msg) return null
        
        const user = JSON.parse(msg.content.toString());

        try {
          await this.emailService.sendUserRegistrationConfirmation(
            user.email,
            user.name
          );
          this.channel.ack(msg);
        } catch (err) {
          console.error("Erro ao enviar email", err);
          this.channel.nack(msg, false, false);
        }
      },
      { noAck: false }
    );
  }
}
