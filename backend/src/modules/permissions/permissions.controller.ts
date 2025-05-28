import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from 'src/dto/permissions/create-route.dto';
import { UpdatePermissionDto } from 'src/dto/permissions/update-route.dto';

@Controller('permissions')
export class PermissionsController {

    constructor(private readonly permissionsService: PermissionsService) {}
    
    @Post()
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }

    @Get()
    findAll() {
        return this.permissionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
        return this.permissionsService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionsService.remove(+id);
    }

}
