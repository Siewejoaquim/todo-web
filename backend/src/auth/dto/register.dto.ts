import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({ example: "Natchop siewe" })
  name: string;

  @ApiProperty({ example: "natchopsiewe@gmail.com" })
  email: string;

  @ApiProperty({ example: "1234578" })
  password: string;

}