import * as rateLimit from 'express-rate-limit';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 5000,
    }),
  );

  await app.listen(3000);
}
bootstrap();
