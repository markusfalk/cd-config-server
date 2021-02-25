import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigService } from '../../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../../_services/configuration/configuration.service';
import { FileAccessService } from '../../_services/file-access/file-access.service';
import { FileSystemService } from '../../_services/file-system/file-system.service';
import { GithubService } from '../../_services/github/github.service';
import { GitlabService } from '../../_services/gitlab/gitlab.service';
import { SemanticVersioningService } from '../../_services/semantic-versioning/semantic-versioning.service';
import { ConfigApiController } from './config-api.controller';

describe('ConfigApiController', () => {
  let controller: ConfigApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigApiController],
      imports: [HttpModule, CacheModule.register()],
      providers: [
        AppConfigService,
        GithubService,
        GitlabService,
        SemanticVersioningService,
        GithubService,
        GitlabService,
        SemanticVersioningService,
        ConfigurationService,
        FileSystemService,
        FileAccessService,
      ],
    }).compile();

    controller = module.get<ConfigApiController>(ConfigApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
