import { Controller, Post, Body, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAuthDto } from 'src/dto/auth/register-user.dto';
import { LoginUserDto } from 'src/dto/auth/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor( private authService: AuthService ) {}

  @Post('register')
  async register(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.authService.register(createUserAuthDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
