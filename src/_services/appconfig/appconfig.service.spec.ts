import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { FileAccessService } from '../file-access/file-access.service';
import { FileSystemService } from '../file-system/file-system.service';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { SemanticVersioningService } from '../semantic-versioning/semantic-versioning.service';
import { AppConfigService } from './appconfig.service';

describe('ConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AppConfigService,
        GithubService,
        ConfigurationService,
        GitlabService,
        SemanticVersioningService,
        FileSystemService,
        FileAccessService,
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
