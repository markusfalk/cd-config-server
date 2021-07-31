import { AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { HttpStatus, Injectable } from '@nestjs/common';

import { Config } from '../../../_interfaces/config.interface';
import { ConfigurationService } from '../../../configuration/configuration/configuration.service';
import { GithubService } from '../../../github/_services/github/github.service';
import { GitlabService } from '../../../gitlab/gitlab/gitlab.service';
import { SemanticVersioningService } from '../../../semantic-versioning/semantic-versioning/semantic-versioning.service';
import { FileSystemService } from '../../../filesystem/_services/file-system/file-system.service';
import { ErrorService } from '../../../error/error/error.service';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly semverService: SemanticVersioningService,
    private readonly fileSystemService: FileSystemService,
    private readonly errorService: ErrorService,
  ) {}

  private getGithubConfig(
    appid: string,
    appversion: string,
    environment: string,
  ) {
    return this.githubService
      .getConfigFromGithub(appid, appversion, environment)
      .pipe(
        switchMap((configFiles) =>
          this.semverService.findMatchingFile(configFiles, appversion),
        ),
        catchError((err: AxiosError) => {
          return throwError(err);
        }),
      );
  }

  private getGitlabConfig(
    appid: string,
    appversion: string,
    environment: string,
  ) {
    return this.gitlabService
      .getConfigFromGitLab(appid, appversion, environment)
      .pipe(
        switchMap((configFiles) =>
          this.semverService.findMatchingFile(configFiles, appversion),
        ),
        catchError((err) => {
          return throwError(err);
        }),
      );
  }

  private getFileSystemConfig(
    appid: string,
    appversion: string,
    environment: string,
  ) {
    return this.fileSystemService
      .getConfigFromFileSystem(appid, environment)
      .pipe(
        switchMap((configFiles) =>
          this.semverService.findMatchingFile(configFiles, appversion),
        ),
        catchError((err) => {
          return throwError(err);
        }),
      );
  }

  private throwInvalidSourceError() {
    return this.errorService.handleHttpError({
      errorMessage: `SOURCE not configured`,
      httpStatus: HttpStatus.BAD_REQUEST,
    });
  }

  getConfig(
    appid: string,
    appversion: string,
    environment: string,
  ): Observable<Config> {
    const source = this.configurationService.getEnvironmentConfig('SOURCE');

    switch (source) {
      case 'github':
        return this.getGithubConfig(appid, appversion, environment);
      case 'gitlab':
        return this.getGitlabConfig(appid, appversion, environment);
      case 'filesystem':
        return this.getFileSystemConfig(appid, appversion, environment);
      default:
        return this.throwInvalidSourceError();
    }
  }
}
