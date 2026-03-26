import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new BadRequestException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid credentials');

    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, name: user.name, email: user.email },
    };
  }

  async register(data) {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) throw new ConflictException('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    
    this.mailService.sendWelcomeEmail(savedUser.email, savedUser.name).catch(err => {
      console.error('❌ Failed to send welcome email:', err);
    });
    
    return savedUser;
  }
}
