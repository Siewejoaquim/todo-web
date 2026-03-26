import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({
    example: "babila",
    description: "Name of the user"
  })
  name: string;

  @ApiProperty({
    example: "h@gmail.com",
    description: "User email address"
  })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "User password"
  })
  password: string;

}