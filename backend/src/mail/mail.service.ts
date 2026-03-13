import * as nodemailer from 'nodemailer';

export class MailService {
  async sendWelcomeEmail(email: string) {

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Account Created',
      text: 'Your account has been created successfully!',
    });
  }
}

//makb lnyx ppzn lgkh