import { CacheModule, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from './_services/configuration/configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './appconfig/appconfig.service';
import { GithubService } from './github/github.service';

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
