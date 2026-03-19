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

  create(createTodoDto: CreateTodoDto, userId: string) {
    const { title, date, time } = createTodoDto;
    return this.todoModel.create({ title, date, time, userId, completed: false });
  }

  findAll(userId: string, type: 'today' | 'scheduled' | 'completed' = 'today') {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (type === 'completed') {
      return this.todoModel.find({ userId, completed: true }).sort({ updatedAt: -1 }).lean();
    }

    if (type === 'scheduled') {
      // future date OR same day but future time
      return this.todoModel
        .find({
          userId,
          completed: { $ne: true },
          $or: [
            { date: { $gt: today } },
            { date: today, time: { $gt: currentTime } },
          ],
        })
        .sort({ date: 1, time: 1 })
        .lean();
    }

    // today: same day, time has already passed or is now (past/current tasks)
    return this.todoModel
      .find({
        userId,
        completed: { $ne: true },
        date: today,
        time: { $lte: currentTime },
      })
      .sort({ time: 1 })
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
