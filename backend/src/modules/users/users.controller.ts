import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReadUserDto } from 'src/dto/users/read-user.dto';
import { CreateUserDto } from 'src/dto/users/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(): Promise<ReadUserDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ReadUserDto> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() createUserDto: CreateUserDto): Promise<number> {
    return this.userService.update(id, createUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}