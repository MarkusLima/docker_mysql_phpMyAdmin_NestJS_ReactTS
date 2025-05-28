import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from '../roles/roles.model';
import { Route } from '../routes/routes.model';

@Table({tableName: 'permissions'})
export class Permission extends Model<Permission> {
    
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
    declare id: number;

    @ForeignKey(() => Role)
    @Column
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

    @ForeignKey(() => Route)
    @Column
    routeId: number;

    @BelongsTo(() => Route)
    route: Route;

    @Default(DataType.NOW)
    @Column
    declare createdAt: Date;

    @Default(DataType.NOW)
    @Column
    declare updatedAt: Date;
}
