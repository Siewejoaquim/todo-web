import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './shemas/todo.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Todo.name, schema: TodoSchema }
    ])
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}