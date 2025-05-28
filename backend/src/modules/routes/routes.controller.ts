import { Controller, Get } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Route } from './routes.model';

@ApiTags('routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesSyncService: RoutesService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as rotas registradas' })
  async listRoutes(): Promise<Route[]> {
    return this.routesSyncService.findAll();
  }
}
