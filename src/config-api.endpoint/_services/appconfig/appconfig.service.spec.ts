import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpException, HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../../../configuration/configuration/configuration.service';
import { FileAccessService } from '../../../filesystem/_services/file-access/file-access.service';
import { GithubService } from '../../../github/_services/github/github.service';
import { GitlabService } from '../../../gitlab/gitlab/gitlab.service';
import { SemanticVersioningService } from '../../../semantic-versioning/semantic-versioning/semantic-versioning.service';
import { AppConfigService } from './appconfig.service';
import { ErrorService } from '../../../error/error/error.service';
import { FileSystemService } from '../../../filesystem/_services/file-system/file-system.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  const configurationService = new ConfigurationService();
  jest
    .spyOn(configurationService, 'getEnvironmentConfig')
    .mockReturnValue(null);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        AppConfigService,
        ErrorService,
        FileAccessService,
        FileSystemService,
        GithubService,
        GitlabService,
        SemanticVersioningService,
        {
          provide: ConfigurationService,
          useValue: configurationService,
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw error with NO environment config', (done) => {
    service
      .getConfig('my-app', '1.0.0', 'test')
      .pipe(
        catchError((err: HttpException) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.message).toEqual('SOURCE not configured');
          expect(err.getStatus()).toEqual(400);
          done();
          return of(err);
        }),
      )
      .subscribe();
  });
});
