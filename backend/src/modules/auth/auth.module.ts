import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { AuthController } from './auth.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({secret: process.env.SECRET_KEY || 'mysecretkey'}),
    RolesModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
