import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ReadUserDto } from 'src/dto/users/read-user.dto';
import { CreateUserDto } from 'src/dto/users/create-user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckPermissions } from 'src/utils/check-permissions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  
  private checkPermissions = new CheckPermissions();

  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna todos os usuários dentro do sistema' })
  async findAll(@Request() req): Promise<ReadUserDto[]> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna o usuário dentro do sistema de acordo com o Id' })
  async findOne(@Request() req, @Param('id') id: number): Promise<ReadUserDto> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria um usuário dentro do sistema' })
  async create(@Request() req, @Body() createUserDto: CreateUserDto): Promise<ReadUserDto> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza o usuário dentro do sistema de acordo com o Id' })
  async update(@Request() req, @Param('id') id: number, @Body() createUserDto: CreateUserDto): Promise<number> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.update(id, createUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Apaga o usuário dentro do sistema de acordo com o Id' })
  async remove(@Request() req, @Param('id') id: number): Promise<void> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.userService.remove(id);
  }

}