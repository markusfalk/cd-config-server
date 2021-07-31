import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigApiModule } from '../config-api.endpoint/config-api.module';
import { AppController } from './app/app.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    CacheModule.register(),
    ConfigApiModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
