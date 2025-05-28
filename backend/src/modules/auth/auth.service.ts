import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserAuthDto } from 'src/dto/auth/register-user.dto';
import { UniqueConstraintError as SequelizeUniqueConstraintError } from 'sequelize';
import { User } from '../users/users.model';
import { InjectModel } from '@nestjs/sequelize';
import { LoginUserDto } from 'src/dto/auth/login-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User, private jwtService: JwtService) {}

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.findByEmail(loginUserDto.email);
    const { password, ...result } = user.toJSON();
  
    if (password && await bcrypt.compare(loginUserDto.password, password)) {
      return user.toJSON();
    }
    return null;
  }

  async login(user: User) {
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserAuthDto: CreateUserAuthDto) {
    try {
      createUserAuthDto.password = await bcrypt.hash(createUserAuthDto.password, 10);
      const user = await this.userModel.create({...createUserAuthDto, roleId: 2});
      return { access_token: this.jwtService.sign({ sub: user.id, email: user.email, roleId: user.roleId }) };
      
    } catch (error) {
      if (error instanceof SequelizeUniqueConstraintError) {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email }}) // Garante que o password será retornado });
  }

}
