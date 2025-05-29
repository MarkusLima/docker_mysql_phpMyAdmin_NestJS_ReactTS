import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Route } from './routes.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesSyncService: RoutesService) {}
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista todas as rotas registradas na aplicação' })
  async listRoutes(@Request() req): Promise<Route[]> {
    console.log('User:', req.user);
    return this.routesSyncService.findAll();
  }
}
