import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigApiModule } from '../../../config-api.endpoint/config-api.module';
import { ConfigurationModule } from '../../../configuration/configuration.module';

import { ErrorService } from '../../../error/error/error.service';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigurationModule, ConfigApiModule],
      providers: [GithubService, ErrorService],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
