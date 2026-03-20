import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: string;

  @Prop({ default: '' })
  time: string;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: false })
  reminder30Sent: boolean;

  @Prop({ default: false })
  reminder15Sent: boolean;

  @Prop({ default: false })
  startSent: boolean;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: 'personal' })
  category: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
