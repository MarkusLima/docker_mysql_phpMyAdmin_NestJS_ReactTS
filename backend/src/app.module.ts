import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { RoutesModule } from './modules/routes/routes.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import sequelizeConfig from './db/ormconfig';
import { JwtStrategy } from './modules/auth/jwt.strategy';

@Module({
  imports: [ 
    SequelizeModule.forRoot(sequelizeConfig), 
    UsersModule, 
    AuthModule, 
    RolesModule, 
    RoutesModule, 
    PermissionsModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
