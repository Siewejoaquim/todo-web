import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({
    example: "Siewejoaquim@gmail.com"
  })
  email: string;

  @ApiProperty({
    example: "jesie123"
  })
  password: string;
}