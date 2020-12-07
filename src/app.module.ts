import { HttpModule, Module } from '@nestjs/common';

import { ConfigurationService } from './_services/configuration/configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from './config/config.service';
import { GithubService } from './github/github.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, ConfigService, GithubService, ConfigurationService],
})
export class AppModule {}
