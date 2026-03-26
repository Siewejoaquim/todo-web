import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const BASE_URL = 'https://musical-snickerdoodle-bca3b7.netlify.app';

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Todo App</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#352323;padding:32px 40px;text-align:center;">
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="background:#C47623;border-radius:50%;width:40px;height:40px;display:inline-block;vertical-align:middle;text-align:center;line-height:40px;">
                  <span style="color:#fff;font-size:20px;font-weight:bold;">✓</span>
                </div>
                <span style="color:#ffffff;font-size:22px;font-weight:bold;vertical-align:middle;margin-left:10px;">Todo App</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;border-top:1px solid #eeeeee;padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#aaaaaa;">
                © ${new Date().getFullYear()} Todo App &nbsp;·&nbsp;
                <a href="${BASE_URL}" style="color:#C47623;text-decoration:none;">Open App</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#cccccc;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

@Injectable()
export class MailService {
  private createTransporter() {
    const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, '');
    
    return nodemailer.createTransport({
      host: '74.125.133.108',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: emailPass,
      },
      tls: {
        rejectUnauthorized: false,
        servername: 'smtp.gmail.com',
      }
    });
  }

  async sendWelcomeEmail(to: string, name?: string) {
    const transporter = this.createTransporter();
    const greeting = name ? `Hi ${name},` : 'Welcome aboard,';
    const body = `
      <h2 style="margin:0 0 8px;color:#352323;font-size:24px;">You're all set! </h2>
      <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6;">
        ${greeting} your account has been created successfully.
        Start organising your day by adding your first todo.
      </p>

      <div style="background:#fff8f0;border-left:4px solid #C47623;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:#352323;font-size:14px;line-height:1.6;">
          📅 <strong>Today Todos</strong> — tasks due today<br/>
          🗓️ <strong>Scheduled Todos</strong> — plan ahead<br/>
          ✅ <strong>Completed Todos</strong> — track your progress
        </p>
      </div>

      <a href="${BASE_URL}"
        style="display:inline-block;padding:14px 32px;background-color:#C47623;color:#ffffff;
               text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;letter-spacing:0.3px;">
        Go to Dashboard →
      </a>

      <p style="margin:28px 0 0;font-size:13px;color:#aaaaaa;">
        If you didn't create this account, you can safely ignore this email.
      </p>
    `;
    try {
      await transporter.sendMail({
        from: `"Todo App" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Welcome to Todo App — You\'re in!',
        html: emailWrapper(body),
      });
      console.log('Welcome email sent to:', to);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendReminderEmail(
    to: string,
    title: string,
    date: string,
    time: string,
    minutesBefore: 30 | 15,
  ) {
    const transporter = this.createTransporter();
    const urgencyColor = minutesBefore === 15 ? '#e53e3e' : '#C47623';
    const urgencyLabel = minutesBefore === 15 ? '⚡ 15 minutes' : '⏰ 30 minutes';

    const body = `
      <h2 style="margin:0 0 8px;color:#352323;font-size:24px;">Task Reminder</h2>
      <p style="margin:0 0 28px;color:#555555;font-size:15px;line-height:1.6;">
        Your task is coming up soon. Don't miss it!
      </p>

      <div style="border:1px solid #eeeeee;border-radius:10px;overflow:hidden;margin-bottom:28px;">
        <div style="background-color:#352323;padding:14px 20px;">
          <p style="margin:0;color:#ffffff;font-size:16px;font-weight:bold;">${title}</p>
        </div>
        <div style="padding:20px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:8px 0;color:#888888;font-size:13px;width:80px;">📅 Date</td>
              <td style="padding:8px 0;color:#352323;font-size:14px;font-weight:600;">${date}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888888;font-size:13px;">🕐 Time</td>
              <td style="padding:8px 0;color:#352323;font-size:14px;font-weight:600;">${time}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888888;font-size:13px;">⏳ In</td>
              <td style="padding:8px 0;">
                <span style="background-color:${urgencyColor};color:#ffffff;font-size:12px;
                             font-weight:bold;padding:3px 10px;border-radius:20px;">
                  ${urgencyLabel}
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <a href="${BASE_URL}"
        style="display:inline-block;padding:14px 32px;background-color:#C47623;color:#ffffff;
               text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
        View Todo →
      </a>
    `;
    try {
      await transporter.sendMail({
        from: `"Todo App" <${process.env.EMAIL_USER}>`,
        to,
        subject: `${minutesBefore === 15 ? '⚡' : '⏰'} Reminder: "${title}" in ${minutesBefore} minutes`,
        html: emailWrapper(body),
      });
      console.log(`Reminder (${minutesBefore}min) sent to ${to} for: ${title}`);
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  }

  async sendStartEmail(
    to: string,
    title: string,
    date: string,
    time: string,
  ) {
    const transporter = this.createTransporter();
    const body = `
      <h2 style="margin:0 0 8px;color:#352323;font-size:24px;">It's time! 🚀</h2>
      <p style="margin:0 0 28px;color:#555555;font-size:15px;line-height:1.6;">
        Your task is starting right now. Time to get it done!
      </p>

      <div style="border:1px solid #eeeeee;border-radius:10px;overflow:hidden;margin-bottom:28px;">
        <div style="background-color:#10b981;padding:14px 20px;">
          <p style="margin:0;color:#ffffff;font-size:16px;font-weight:bold;">${title}</p>
        </div>
        <div style="padding:20px;">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:8px 0;color:#888888;font-size:13px;width:80px;">📅 Date</td>
              <td style="padding:8px 0;color:#352323;font-size:14px;font-weight:600;">${date}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888888;font-size:13px;">🕐 Time</td>
              <td style="padding:8px 0;color:#352323;font-size:14px;font-weight:600;">${time}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888888;font-size:13px;">🟢 Status</td>
              <td style="padding:8px 0;">
                <span style="background-color:#10b981;color:#ffffff;font-size:12px;
                             font-weight:bold;padding:3px 10px;border-radius:20px;">
                  Starting now
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <a href="${BASE_URL}"
        style="display:inline-block;padding:14px 32px;background-color:#10b981;color:#ffffff;
               text-decoration:none;border-radius:8px;font-weight:bold;font-size:15px;">
        Mark as Done →
      </a>
    `;
    try {
      await transporter.sendMail({
        from: `"Todo App" <${process.env.EMAIL_USER}>`,
        to,
        subject: `🚀 Starting now: "${title}"`,
        html: emailWrapper(body),
      });
      console.log(`Start email sent to ${to} for: ${title}`);
    } catch (error) {
      console.error('Error sending start email:', error);
    }
  }
}
