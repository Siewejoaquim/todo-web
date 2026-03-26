import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TodoReminderService } from './todo-reminder.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './shemas/todo.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService, TodoReminderService, MailService],
})
export class TodosModule {}
