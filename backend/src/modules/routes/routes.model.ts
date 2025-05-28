import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table({tableName: 'routes'})
export class Route extends Model<Route> {
    
    @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
    declare id: number;

    @Column
    url: string;

    @Column
    method: string;

    @Default(DataType.NOW)
    @Column
    declare createdAt: Date;

    @Default(DataType.NOW)
    @Column
    declare updatedAt: Date;
}
