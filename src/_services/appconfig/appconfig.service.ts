import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { ConfigurationService } from '../configuration/configuration.service';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { SemanticVersioningService } from '../semantic-versioning/semantic-versioning.service';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly githubService: GithubService,
    private readonly gitlabService: GitlabService,
    private readonly semverService: SemanticVersioningService,
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

  getConfig(appid: string, appversion: string, environment: string) {
    const source = this.configurationService.getEnvironmentConfig('GIT_SOURCE');
    if (!source) {
      const err = new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `GIT_SOURCE not configured`,
        },
        HttpStatus.BAD_REQUEST,
      );
      return throwError(err);
    }

    if (source === 'github') {
      return this.getGithubConfig(appid, appversion, environment).pipe(
        catchError((err) => {
          return throwError(err);
        }),
      );
    } else if (source === 'gitlab') {
      return this.getGitlabConfig(appid, appversion, environment).pipe(
        catchError((err) => {
          return throwError(err);
        }),
      );
    }
  }
}
