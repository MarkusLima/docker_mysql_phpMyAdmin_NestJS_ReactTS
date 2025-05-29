import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Role } from '../roles/roles.model';

@Table({tableName: 'users'})
export class User extends Model<User> {
    
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ allowNull: true })
    password: string;

    @ForeignKey(() => Role)
    @Column
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

    @Default(DataType.NOW)
    @Column
    declare createdAt: Date;

    @Default(DataType.NOW)
    @Column
    declare updatedAt: Date;

    @Default(DataType.NOW)
    @Column
    declare lastAccessAt: Date;
}
