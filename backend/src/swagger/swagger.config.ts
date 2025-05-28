import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('API de exemplo com NestJS, Sequelize e Swagger')
  .setVersion('1.0')
  .addBearerAuth() // Para JWT
  .build();