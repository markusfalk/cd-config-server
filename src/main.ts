import * as rateLimit from 'express-rate-limit';
import { join } from 'path';

import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version } from './_services/configuration/version.json';
import { AppModule } from './app.endpoint/app.module';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
  app.use(helmet());

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
  app.use(
    rateLimit({
      windowMs: parseFloat(process.env['RATE_LIMIT_MS']) || 360000,
      max: parseFloat(process.env['RATE_LIMIT_MAX']) || 5000,
    }),
  );

  // MVC
  app.useStaticAssets(join(__dirname, '..', 'src', '_assets'));
  app.setBaseViewsDir(join(__dirname, '..', 'src', '_views'));
  app.setViewEngine('hbs');

  // CORS
  const corsOptions: CorsOptions = {
    origin: process.env['CORS_ORIGIN'] || '*',
  };
  app.enableCors(corsOptions);

  // start app
  await app.listen(3000);
}

bootstrap();
