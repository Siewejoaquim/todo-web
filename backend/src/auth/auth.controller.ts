import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService, } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
register(@Body() body) {
  return this.authService.register(body);
}

}