import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../../configuration/configuration/configuration.service';
import { ErrorService } from '../../error/error/error.service';
import { GitlabService } from './gitlab.service';

describe('GitlabService', () => {
  let service: GitlabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GitlabService, ConfigurationService, ErrorService],
    }).compile();

    service = module.get<GitlabService>(GitlabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
