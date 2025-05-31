import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReadUserDto } from 'src/dto/users/read-user.dto';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CheckPermissions } from 'src/utils/check-permissions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/dto/users/update-user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  
  private checkPermissions = new CheckPermissions();

  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna somente o próprio usuários logado dentro do sistema' })
  async findMe(@Request() req): Promise<ReadUserDto> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.findOne(req.user.id || req.user.userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza o proprio usuário dentro do sistema' })
  async updateMe(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<number> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.update(req.user.id || req.user.userId, updateUserDto);
  }

}