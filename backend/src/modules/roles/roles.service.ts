import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { CreateRoleDto } from 'src/dto/roles/create-role.dto';
import { UpdateRoleDto } from 'src/dto/roles/update-role.dto';
import { UniqueConstraintError as SequelizeUniqueConstraintError } from 'sequelize';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private roleModel: typeof Role) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      return await this.roleModel.create(createRoleDto);
    } catch (error) {
      if (error instanceof SequelizeUniqueConstraintError) {
        throw new ConflictException('Já existe um role com esse nome.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Role[]> {
    return this.roleModel.findAll();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleModel.findByPk(id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    return role.update(updateRoleDto);
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await role.destroy();
  }
}
