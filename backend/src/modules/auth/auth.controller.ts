import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserAuthDto } from 'src/dto/auth/register-user.dto';
import { LoginUserDto } from 'src/dto/auth/login-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor( private authService: AuthService ) {}

  @Post('register')
  @ApiOperation({ summary: 'Cria um usuários dentro do sistema' })
  async register(@Body() createUserAuthDto: CreateUserAuthDto) {
    return this.authService.register(createUserAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realiza login de usuário dentro do sistema' })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.validateUser(loginUserDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
