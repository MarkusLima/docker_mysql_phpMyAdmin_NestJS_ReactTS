import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger';
import { RoutesService } from './modules/routes/routes.service';
import { seedInitialData } from './seeders/initial-data';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: '*'});

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  setupSwagger(app);

  await app.init();

  const routesService = app.get(RoutesService);
  if (!routesService) throw new Error('RoutesService not found in the application context');

  await routesService.syncRoutes(app);

  await seedInitialData();

  await app.listen(3000);

}

bootstrap();
