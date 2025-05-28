import { Table, Column, Model, DataType, Default, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({tableName: 'roles'})
export class Role extends Model<Role> {
    
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column({ type: DataType.STRING, allowNull: false, unique: true})
    name: string;

    @Default(DataType.NOW)
    @Column
    declare createdAt: Date;

    @Default(DataType.NOW)
    @Column
    declare updatedAt: Date;
}
