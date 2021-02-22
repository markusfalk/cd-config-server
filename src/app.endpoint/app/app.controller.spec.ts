import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigService } from '../../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../../_services/configuration/configuration.service';
import { FileAccessService } from '../../_services/file-access/file-access.service';
import { FileSystemService } from '../../_services/file-system/file-system.service';
import { GithubService } from '../../_services/github/github.service';
import { GitlabService } from '../../_services/gitlab/gitlab.service';
import {
  SemanticVersioningService
} from '../../_services/semantic-versioning/semantic-versioning.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register()],
      controllers: [AppController],
      providers: [
        AppConfigService,
        GithubService,
        SemanticVersioningService,
        GitlabService,
        ConfigurationService,
        FileSystemService,
        FileAccessService,
      ],
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
