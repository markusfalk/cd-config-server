import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../_services/configuration/configuration.service';
import { GithubService } from '../github/github.service';
import { AppConfigService } from './appconfig.service';

describe('ConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AppConfigService, GithubService, ConfigurationService],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
