import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {

  @ApiProperty({
    example: "HELLO IS JOAQUIM",
    description: "WHAT'S UP?"
  })
  title: string;

  @ApiProperty({
    example: "hELLO IS JOAQUIM",
    description: "WHAT'S UP?"
  })
  description: string;
}