import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import { ReadUserDto } from 'src/dto/users/read-user.dto';
import { CreateUserDto } from 'src/dto/users/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  private toReadUserDto(user: User): ReadUserDto {
    const { id, name, email, roleId, createdAt, updatedAt } = user.get();
    return { id, name, email, roleId, createdAt, updatedAt };
  }

  async create(createUserDto: CreateUserDto): Promise<ReadUserDto> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userModel.create({ ...createUserDto });
    return this.toReadUserDto(user);
  }

  async findAll(): Promise<ReadUserDto[]> {
    const users = await this.userModel.findAll();
    return users.map(user => this.toReadUserDto(user));
  }

  async findOne(id: number): Promise<ReadUserDto> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User not found`);
    return this.toReadUserDto(user);
  }

  async update(id: number, userDto: Partial<CreateUserDto>): Promise<number> {
    const userExist = await this.userModel.findByPk(id);
    if (!userExist) throw new NotFoundException(`User not found`);
    const [affectedCount] = await this.userModel.update(userDto, { where: { id } });
    return affectedCount;
  }

  async remove(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException(`User not found`);
    await user.destroy();
  }
}
