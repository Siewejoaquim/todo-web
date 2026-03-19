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
      $or: [{ reminder30Sent: false }, { reminder15Sent: false }],
    }).lean();

    if (!todos.length) return;

    const userIds = [...new Set(todos.map((t) => t.userId))];
    const users = await this.userModel.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u.email]));

    for (const todo of todos) {
      const todoDate = new Date(`${todo.date}T${todo.time}:00`);
      const diffMins = (todoDate.getTime() - now.getTime()) / 60000;
      const email = userMap.get(todo.userId.toString());
      if (!email) continue;

      if (!todo.reminder30Sent && diffMins > 29 && diffMins <= 31) {
        await this.mailService.sendReminderEmail(email, todo.title, todo.date, todo.time, 30);
        await this.todoModel.findByIdAndUpdate(todo._id, { reminder30Sent: true });
        this.logger.log(`30-min reminder sent for "${todo.title}"`);
      }

      if (!todo.reminder15Sent && diffMins > 14 && diffMins <= 16) {
        await this.mailService.sendReminderEmail(email, todo.title, todo.date, todo.time, 15);
        await this.todoModel.findByIdAndUpdate(todo._id, { reminder15Sent: true });
        this.logger.log(`15-min reminder sent for "${todo.title}"`);
      }
    }
  }
}
