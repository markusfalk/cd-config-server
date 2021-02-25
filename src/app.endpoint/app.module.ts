import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppConfigService } from '../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../_services/configuration/configuration.service';
import { FileAccessService } from '../_services/file-access/file-access.service';
import { FileSystemService } from '../_services/file-system/file-system.service';
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
    FileAccessService,
    AppConfigService,
    FileSystemService,
    ConfigurationService,
    GithubService,
    GitlabService,
    SemanticVersioningService,
  ],
})
export class AppModule {}
