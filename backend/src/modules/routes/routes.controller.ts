import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Route } from './routes.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckPermissions } from 'src/utils/check-permissions';

@ApiTags('Routes')
@ApiBearerAuth('access-token')
@Controller('routes')
export class RoutesController {

  private checkPermissions = new CheckPermissions();

  constructor(
    private readonly routesSyncService: RoutesService,
  ) {}
  
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lista todas as rotas registradas na aplicação' })
  async listRoutes(@Request() req): Promise<Route[]> {
    await this.checkPermissions.checkUserPermissionsAndRegisterAcess( req.user, req.route.path, req.method.toUpperCase());
    return this.routesSyncService.findAll();
  }
}
