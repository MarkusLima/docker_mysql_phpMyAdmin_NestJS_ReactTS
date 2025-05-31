import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from 'src/dto/permissions/create-route.dto';
import { UpdatePermissionDto } from 'src/dto/permissions/update-route.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckPermissions } from 'src/utils/check-permissions';

@ApiTags('Permissions')
@ApiBearerAuth('access-token')
@Controller('permissions')
export class PermissionsController {

    private checkPermissions = new CheckPermissions();

    constructor(private readonly permissionsService: PermissionsService) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cria um usuários dentro do sistema' })
    async create(@Request() req, @Body() createPermissionDto: CreatePermissionDto) {
        await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cria um usuários dentro do sistema' })
    async findAll(@Request() req) {
        await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
        return this.permissionsService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cria um usuários dentro do sistema' })
    async findOne(@Request() req, @Param('id') id: string) {
        await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
        return this.permissionsService.findOne(+id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cria um usuários dentro do sistema' })
    async update(@Request() req, @Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cria um usuários dentro do sistema' })
    async remove(@Request() req, @Param('id') id: string) {
        await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
        return this.permissionsService.remove(+id);
    }

}
