import * as nodemailer from 'nodemailer';

export class MailService {
  async sendWelcomeEmail(email: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'natchopsiewe@gmail.com',
        pass: 'makb lnyx ppzn lgkh',
      },
    });

    await transporter.sendMail({
      from: 'Todo App',
      to: email,
      subject: 'Account Created',
      text: 'Your account has been created successfully!',
    });
  }
}