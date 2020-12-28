import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from '../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../_services/configuration/configuration.service';
import { GithubService } from '../_services/github/github.service';
import { GitlabService } from '../_services/gitlab/gitlab.service';
import { SemanticVersioningService } from '../_services/semantic-versioning/semantic-versioning.service';
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
  providers: [
    AppConfigService,
    GithubService,
    ConfigurationService,
    GitlabService,
    SemanticVersioningService,
  ],
})
export class AppModule {}
