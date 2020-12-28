import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from '../../_services/app/app.service';
import { AppConfigService } from '../../_services/appconfig/appconfig.service';
import { ConfigurationService } from '../../_services/configuration/configuration.service';
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
        AppService,
        AppConfigService,
        AppService,
        GithubService,
        SemanticVersioningService,
        GitlabService,
        ConfigurationService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return', () => {
      expect(appController.getApiRoot()).toContain(
        'Continuous Delivery Configuration Server',
      );
    });
  });
});
