import { CacheModule, HttpModule, Module } from '@nestjs/common';

import { AppConfigService } from '../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../_services/configuration/configuration.service';
import { FileAccessService } from '../_services/file-access/file-access.service';
import { FileSystemService } from '../_services/file-system/file-system.service';
import { GithubService } from '../_services/github/github.service';
import { GitlabService } from '../_services/gitlab/gitlab.service';
import { SemanticVersioningService } from '../_services/semantic-versioning/semantic-versioning.service';
import { ConfigApiController } from './config-api/config-api.controller';

@Module({
  controllers: [ConfigApiController],
  imports: [HttpModule, CacheModule.register()],
  providers: [
    FileAccessService,
    AppConfigService,
    ConfigurationService,
    FileSystemService,
    GithubService,
    GitlabService,
    SemanticVersioningService,
  ],
})
export class ConfigApiModule {}
