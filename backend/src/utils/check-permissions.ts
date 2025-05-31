import { ForbiddenException, Injectable } from '@nestjs/common';
import { Permission } from 'src/modules/permissions/permissions.model';
import { Role } from 'src/modules/roles/roles.model';
import { Route } from 'src/modules/routes/routes.model';
import { User } from 'src/modules/users/users.model';

@Injectable()
export class CheckPermissions {

    private roleModel: typeof Role;
    private routeModel: typeof Route;
    private permissionModel: typeof Permission;
    private userModel: typeof User;

    constructor() {
        this.roleModel = Role;
        this.routeModel = Route;
        this.permissionModel = Permission;
        this.userModel = User;
    }

    async checkUserPermissionsAndRegisterAcess( user: any, routePath: string, method: string ): Promise<void> {

        try {
            
            const userId = user.id || user.userId;
    
            await this.userModel.update({ lastAccessAt: new Date() }, { where: { id: userId } });
    
            if (!user.roleId) throw new ForbiddenException('Usuário sem roleId válido.');
    
            const roleExists = await this.roleModel.findByPk(user.roleId);
            if (!roleExists) throw new ForbiddenException('RoleId inválido.');
    
            const existRoute = await this.routeModel.findOne({ where: { url: routePath, method: method.toUpperCase() } });
            if (!existRoute) throw new ForbiddenException('Route inválida ou não cadastrada.');
    
            const hasPermission = await this.permissionModel.findOne({ where: { roleId: roleExists.id, routeId: existRoute.id } });
            if (!hasPermission) throw new ForbiddenException('Permissão negada para acessar esta rota.');
            
        } catch (error) {

            console.error('Erro ao verificar permissões:', error);
            throw new ForbiddenException('Erro ao verificar permissões: ' + error.message);
            
        }
    }
}
