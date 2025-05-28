import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Permission } from 'src/modules/permissions/permissions.model';
import { Role } from 'src/modules/roles/roles.model';
import { Route } from 'src/modules/routes/routes.model';
import { User } from 'src/modules/users/users.model';
dotenv.config();

const config: SequelizeModuleOptions = {
    dialect: 'mysql',
    host: process.env.DATABASE_HOST || 'db',
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || 'myuser',
    password: process.env.DATABASE_PASSWORD || 'mypassword',
    database: process.env.DATABASE_NAME || 'myappdb',
    autoLoadModels: true,
    synchronize: true,
    models: [User, Role, Route, Permission],
};

export default config;