import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Route } from './routes.model';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [SequelizeModule.forFeature([Route])],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}
