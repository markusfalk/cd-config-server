import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { GitlabService } from './gitlab.service';

describe('GitlabService', () => {
  let service: GitlabService;
  // let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GitlabService, ConfigurationService],
    }).compile();

    service = module.get<GitlabService>(GitlabService);
    // http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
