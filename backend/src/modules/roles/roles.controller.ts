import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { CheckPermissions } from 'src/utils/check-permissions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Roles')
@ApiBearerAuth('access-token')
@Controller('roles')
export class RolesController {

  private checkPermissions = new CheckPermissions();
  
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cria um role/papel dentro do sistema' })
  async create(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna todos os role/papeis dentro do sistema' })
  async findAll(@Request() req) {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.rolesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retorna o role/papeis dentro do sistema de acordo com o Id' })
  async findOne(@Request() req, @Param('id') id: string) {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.rolesService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualiza o role/papeis dentro do sistema de acordo com o Id' })
  async update(@Request() req, @Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    console.log('updateRoleDto', updateRoleDto);
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Apaga o role/papeis dentro do sistema de acordo com o Id' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.rolesService.remove(+id);
  }
}
