import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorService } from '../../error/error/error.service';

import { AppConfigService } from '../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../../configuration/configuration/configuration.service';
import { FileAccessService } from '../../filesystem/file-access/file-access.service';
import { FileSystemService } from '../../filesystem/file-system/file-system.service';
import { GithubService } from '../../github/github/github.service';
import { GitlabService } from '../../gitlab/gitlab/gitlab.service';
import { SemanticVersioningService } from '../../semantic-versioning/semantic-versioning/semantic-versioning.service';
import { ConfigApiController } from './config-api.controller';

describe('ConfigApiController', () => {
  let controller: ConfigApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigApiController],
      imports: [HttpModule, CacheModule.register()],
      providers: [
        ErrorService,
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
