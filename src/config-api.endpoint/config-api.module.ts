import { CacheModule, HttpModule, Module } from '@nestjs/common';

import { AppConfigService } from '../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../_services/configuration/configuration.service';
import { GithubService } from '../_services/github/github.service';
import { GitlabService } from '../_services/gitlab/gitlab.service';
import {
  SemanticVersioningService
} from '../_services/semantic-versioning/semantic-versioning.service';
import { ConfigApiController } from './config-api/config-api.controller';

@Module({
  controllers: [ConfigApiController],
  imports: [HttpModule, CacheModule.register()],
  providers: [
    AppConfigService,
    GithubService,
    GitlabService,
    ConfigurationService,
    SemanticVersioningService,
  ],
})
export class ConfigApiModule {}
