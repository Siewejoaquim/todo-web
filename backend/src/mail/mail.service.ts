import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendWelcomeEmail(email: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: `"Todo App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to Todo App',
        html: `
        <div style="font-family: Arial; padding:20px;">
          
          <h2>Welcome to Todo App </h2>
          
          <p>Your account has been created successfully.</p>

          <p>You can login using your app:</p>

          <a href="https://resplendent-capybara-5fd5ef.netlify.app/"
             style="
              display:inline-block;
              padding:12px 25px;
              background-color:#4CAF50;
              color:white;
              text-decoration:none;
              border-radius:5px;
              font-weight:bold;
             ">
             Login
          </a>

          <p style="margin-top:20px;">
            If you didn't create this account, please ignore this email.
          </p>

        </div>
        `,
      });

      console.log('Email sent successfully to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}