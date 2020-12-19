import * as rateLimit from 'express-rate-limit';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version } from './_services/configuration/version.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Continuous Delivery Config Server')
    .setDescription(
      'Used to configure your app at runtime at different stages of your continuous delivery pipeline.',
    )
    .setVersion(version)
    // .addTag('configs') // TODO: find out what this is for
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  // Rate Limit
  // TODO: get rate limit from .env
  app.use(
    rateLimit({
      windowMs: parseFloat(process.env['RATE_LIMIT_MS']) || 360000,
      max: parseFloat(process.env['RATE_LIMIT_MAX']) || 5000,
    }),
  );

  await app.listen(3000);
}
bootstrap();
