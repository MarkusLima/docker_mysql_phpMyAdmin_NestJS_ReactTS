import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('The API description')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // opcional
      name: 'Authorization',
      in: 'header',
    },
    'access-token', // <-- nome da security, importante!
  )
  .build();