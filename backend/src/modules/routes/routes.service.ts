import { INestApplication, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Route } from './routes.model';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route) private routeRepository: typeof Route,
  ) {}

  async syncRoutes(app: INestApplication): Promise<void> {
    const server = app.getHttpServer();
    const router = server._events?.request?.router || server.router;

    if (!router || !router.stack) {
      throw new Error('Não foi possível acessar o stack de rotas do Express.');
    }

    const stack = router.stack;

    for (const layer of stack) {
      if (layer.route) {
        const { path, methods } = layer.route;

        for (const method in methods) {
          const exists = await this.routeRepository.findOne({
            where: { url: path, method: method.toUpperCase() },
          });

          if (!exists) {
            await this.routeRepository.create({
              url: path,
              method: method.toUpperCase(),
            });
          }
        }
      }
    }
  }

  async findAll(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }
  
}

