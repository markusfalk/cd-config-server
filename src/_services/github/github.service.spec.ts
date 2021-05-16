import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { ErrorService } from '../error/error.service';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GithubService, ConfigurationService, ErrorService],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
