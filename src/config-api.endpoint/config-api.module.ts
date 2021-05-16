import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ErrorService } from '../error/error/error.service';

import { AppConfigService } from './_services/appconfig/appconfig.service';
import { ConfigurationService } from '../configuration/configuration/configuration.service';
import { SemanticVersioningService } from '../semantic-versioning/semantic-versioning/semantic-versioning.service';
import { ConfigApiController } from './config-api/config-api.controller';
import { FilesystemModule } from '../filesystem/filesystem.module';
import { GithubModule } from '../github/github.module';
import { GitlabModule } from '../gitlab/gitlab.module';

@Module({
  controllers: [ConfigApiController],
  imports: [
    HttpModule,
    CacheModule.register(),
    FilesystemModule,
    GithubModule,
    GitlabModule,
  ],
  providers: [
    ErrorService,
    AppConfigService,
    ConfigurationService,
    SemanticVersioningService,
  ],
})
export class ConfigApiModule {}
