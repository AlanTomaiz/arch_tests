import amqp from "amqplib";
import { EmailService } from "../services/EmailService";

export class RabbitMQConsumer {
  private channel!: amqp.Channel;
  private readonly queueName = "user.registered";

  constructor(private url: string, private emailService: EmailService) {}

  async connect() {
    const connection = await amqp.connect(this.url);
    this.channel = await connection.createChannel();
    await this.channel.assertQueue(this.queueName, { durable: true });

    this.startConsuming();
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
