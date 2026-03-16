import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTodoDto {

  @ApiPropertyOptional({
    example: "joaquim's todo"
  })
  title?: string;

  @ApiPropertyOptional({
    example: "update joaquims"
  })
  description?: string;
}