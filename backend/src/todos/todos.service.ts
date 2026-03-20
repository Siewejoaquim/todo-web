import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './shemas/todo.schema';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name)
    private todoModel: Model<Todo>,
  ) {}

  create(dto: CreateTodoDto, userId: string) {
    const { title, date, time, category } = dto;
    return this.todoModel.create({
      title, date, time: time ?? '', userId,
      category: category ?? 'personal',
      completed: false,
    });
  }

  findAll(userId: string, type: 'today' | 'scheduled' | 'completed' = 'today', category?: string) {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const categoryFilter = category ? { category } : {};

    if (type === 'completed') {
      return this.todoModel.find({ userId, completed: true, ...categoryFilter }).sort({ updatedAt: -1 }).lean();
    }

    if (type === 'scheduled') {
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      return this.todoModel
        .find({
          userId,
          completed: { $ne: true },
          time: { $nin: [null, ''] },
          ...categoryFilter,
          $or: [
            { date: { $gt: today } },
            { date: today, time: { $gt: currentTime } },
          ],
        })
        .sort({ date: 1, time: 1 })
        .lean();
    }

    return this.todoModel
      .find({
        userId,
        completed: { $ne: true },
        $or: [{ time: { $exists: false } }, { time: null }, { time: '' }],
        ...categoryFilter,
      })
      .sort({ date: 1, createdAt: -1 })
      .lean();
  }

  findOne(id: string) {
    return this.todoModel.findById(id).lean();
  }

  update(id: string, data: UpdateTodoDto) {
    return this.todoModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  delete(id: string) {
    return this.todoModel.findByIdAndDelete(id);
  }
}
