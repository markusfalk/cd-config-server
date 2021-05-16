import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigApiController } from './config-api.controller';
import { GitlabModule } from '../../gitlab/gitlab.module';
import { GithubModule } from '../../github/github.module';
import { ErrorModule } from '../../error/error.module';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { FilesystemModule } from '../../filesystem/filesystem.module';
import { SemanticVersioningModule } from '../../semantic-versioning/semantic-versioning.module';
import { ConfigApiModule } from '../config-api.module';

describe('ConfigApiController', () => {
  let controller: ConfigApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigApiController],
      imports: [
        HttpModule,
        CacheModule.register(),
        GitlabModule,
        GithubModule,
        ErrorModule,
        ConfigApiModule,
        ConfigurationModule,
        FilesystemModule,
        SemanticVersioningModule,
      ],
    }).compile();

    controller = module.get<ConfigApiController>(ConfigApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
