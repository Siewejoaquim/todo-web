import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @ApiProperty({ example: '2026-03-18' })
  date: string;

  @ApiProperty({ example: '09:00' })
  time: string;
}
