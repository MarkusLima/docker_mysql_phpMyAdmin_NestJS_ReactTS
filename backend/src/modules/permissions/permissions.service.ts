import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from './permissions.model';
import { CreatePermissionDto } from 'src/dto/permissions/create-route.dto';
import { UpdatePermissionDto } from 'src/dto/permissions/update-route.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class PermissionsService {

    constructor(@InjectModel(Permission) private permissionModel: typeof Permission) {}

    async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
        try {

            const permission = await this.permissionModel.findOne({
                where: { roleId: createPermissionDto.roleId, routeId: createPermissionDto.routeId},
            });

            if (permission) throw new ConflictException('Permission already exists for this role and route.');
            
            return await this.permissionModel.create(createPermissionDto);

        } catch (error) {
            throw error;
        }
    }

    async findAll(): Promise<Permission[]> {
        return this.permissionModel.findAll();
    }

    async findOne(id: number): Promise<Permission> {
        const permission = await this.permissionModel.findByPk(id);
        if (!permission) throw new NotFoundException('Permission not found');
        return permission;
    }

    async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {

        const permission = await this.findOne(id);

        if (!permission) throw new NotFoundException('Permission not found');

        const permissionExist = await this.permissionModel.findOne({
             where: { roleId: updatePermissionDto.roleId, routeId: updatePermissionDto.routeId},
        });

        if (permissionExist) throw new ConflictException('Permission already exists for this role and route.');

        return permission.update(updatePermissionDto);
    }

    async remove(id: number): Promise<void> {
        const permission = await this.findOne(id);
        if (!permission) throw new NotFoundException('Permission not found');
        await permission.destroy();
    }

}
