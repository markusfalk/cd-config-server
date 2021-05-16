import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigApiModule } from '../../config-api.endpoint/config-api.module';

import { AppConfigService } from '../../config-api.endpoint/_services/appconfig/appconfig.service';
import { ConfigurationModule } from '../../configuration/configuration.module';
import { FilesystemModule } from '../../filesystem/filesystem.module';
import { GithubModule } from '../../github/github.module';
import { GitlabModule } from '../../gitlab/gitlab.module';
import { SemanticVersioningModule } from '../../semantic-versioning/semantic-versioning.module';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        CacheModule.register(),
        FilesystemModule,
        GithubModule,
        GitlabModule,
        ConfigurationModule,
        SemanticVersioningModule,
        ConfigApiModule,
      ],
      controllers: [AppController],
      providers: [AppConfigService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return', () => {
      expect(appController.getApiRoot()).toEqual({
        title: 'Continuous Delivery Configuration Server',
      });
    });
  });
});
