import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigurationService } from './_services/configuration/configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './appconfig/appconfig.service';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { SemanticVersioningService } from './semantic-versioning/semantic-versioning.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), CacheModule.register()],
  controllers: [AppController],
  providers: [
    AppService,
    AppConfigService,
    GithubService,
    ConfigurationService,
    GitlabService,
    SemanticVersioningService,
  ],
})
export class AppModule {}
