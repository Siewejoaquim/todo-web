import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './shemas/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {

  constructor(
    @InjectModel(Todo.name)
    private todoModel: Model<Todo>
  ) {}

  create(createTodoDto: CreateTodoDto, userId: string) {
    return this.todoModel.create({
      ...createTodoDto,
      userId
    });
  }

  findAll(userId: string) {
    return this.todoModel.find({ userId });
  }

  findOne(id: string) {
    return this.todoModel.findById(id);
  }

  update(id: string, data: any) {
    return this.todoModel.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id: string) {
    return this.todoModel.findByIdAndDelete(id);
  }

}