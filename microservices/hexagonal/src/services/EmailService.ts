import nodemailer from "nodemailer";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.example.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendUserRegistrationConfirmation(email: string, name: string) {
    await this.transporter.sendMail({
      from: '"Equipe" <noreply@example.com>',
      to: email,
      subject: "Confirmação de cadastro",
      text: `Olá ${name}, seu cadastro foi realizado com sucesso!`,
    });
  }
}
