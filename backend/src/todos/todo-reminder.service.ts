import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './shemas/todo.schema';
import { MailService } from '../mail/mail.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class TodoReminderService {
  private readonly logger = new Logger(TodoReminderService.name);

  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: MailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkReminders() {
    const now = new Date();

    const todos = await this.todoModel.find({
      completed: { $ne: true },
      $or: [{ reminder30Sent: false }, { reminder15Sent: false }, { startSent: false }],
    }).lean();

    if (!todos.length) return;

    const userIds = [...new Set(todos.map((t) => t.userId))];
    const users = await this.userModel.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u.email]));

    const reminderRules = [
      { 
        sentField: 'reminder30Sent', 
        minDiff: 29, 
        maxDiff: 31, 
        minutes: 30,
        sendEmail: (email: string, title: string, date: string, time: string) => 
          this.mailService.sendReminderEmail(email, title, date, time, 30),
        logMessage: (title: string) => `30-min reminder sent for "${title}"`
      },
      { 
        sentField: 'reminder15Sent', 
        minDiff: 14, 
        maxDiff: 16, 
        minutes: 15,
        sendEmail: (email: string, title: string, date: string, time: string) => 
          this.mailService.sendReminderEmail(email, title, date, time, 15),
        logMessage: (title: string) => `15-min reminder sent for "${title}"`
      },
      { 
        sentField: 'startSent', 
        minDiff: -1, 
        maxDiff: 1, 
        minutes: 0,
        sendEmail: (email: string, title: string, date: string, time: string) => 
          this.mailService.sendStartEmail(email, title, date, time),
        logMessage: (title: string) => `Start email sent for "${title}"`
      },
    ];

    const emailPromises: Promise<any>[] = [];
    const updatePromises: Promise<any>[] = [];

    for (const todo of todos) {
      const email = userMap.get(todo.userId.toString());
      if (!email) continue;

      const todoDate = new Date(`${todo.date}T${todo.time}:00`);
      const diffMins = (todoDate.getTime() - now.getTime()) / 60000;

      for (const rule of reminderRules) {
        if (!todo[rule.sentField] && diffMins > rule.minDiff && diffMins <= rule.maxDiff) {
          emailPromises.push(
            rule.sendEmail(email, todo.title, todo.date, todo.time)
              .then(() => this.logger.log(rule.logMessage(todo.title)))
          );
          updatePromises.push(
            this.todoModel.findByIdAndUpdate(todo._id, { [rule.sentField]: true })
          );
        }
      }
    }

    await Promise.all([...emailPromises, ...updatePromises]);
  }
}
