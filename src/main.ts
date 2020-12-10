import * as rateLimit from 'express-rate-limit';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Continuous Delivery Config Server for Github')
    .setDescription(
      'Used to configure your app at runtime at different stages of your continuous delivery pipeline.',
    )
    .setVersion('0.0.1')
    // .addTag('configs')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Rate Limit
  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 5000,
    }),
  );

  await app.listen(3000);
}
bootstrap();
