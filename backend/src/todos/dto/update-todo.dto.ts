import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTodoDto {
  @ApiPropertyOptional({ example: 'Buy groceries' })
  title?: string;

  @ApiPropertyOptional({ example: '2026-03-18' })
  date?: string;

  @ApiPropertyOptional({ example: '09:00' })
  time?: string;

  @ApiPropertyOptional({ example: true })
  completed?: boolean;
}
