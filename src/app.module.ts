import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigurationService } from './_services/configuration/configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './appconfig/appconfig.service';
import { GithubService } from './github/github.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    AppConfigService,
    GithubService,
    ConfigurationService,
  ],
})
export class AppModule {}
