import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorService } from '../../error/error/error.service';

import { AppConfigService } from '../../config-api.endpoint/_services/appconfig/appconfig.service';
import { ConfigurationService } from '../../configuration/configuration/configuration.service';
import { FileAccessService } from '../../filesystem/file-access/file-access.service';
import { FileSystemService } from '../../filesystem/file-system/file-system.service';
import { GithubService } from '../../github/github/github.service';
import { GitlabService } from '../../gitlab/gitlab/gitlab.service';
import { SemanticVersioningService } from '../../semantic-versioning/semantic-versioning/semantic-versioning.service';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register()],
      controllers: [AppController],
      providers: [
        ErrorService,
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
