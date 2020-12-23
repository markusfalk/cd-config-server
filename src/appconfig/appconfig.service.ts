import { switchMap } from 'rxjs/operators';

import { Injectable } from '@nestjs/common';

import { ConfigurationService } from '../_services/configuration/configuration.service';
import { GithubService } from '../github/github.service';
import { GitlabService } from '../gitlab/gitlab.service';
import { SemanticVersioningService } from '../semantic-versioning/semantic-versioning.service';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly githubService: GithubService,
    private readonly configurationService: ConfigurationService,
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
      );
  }

  getConfig(appid: string, appversion: string, environment: string) {
    const source = this.configurationService.getEnvironmentConfig('GIT_SOURCE');
    if (source === 'github') {
      return this.getGithubConfig(appid, appversion, environment);
    } else if (source === 'gitlab') {
      return this.getGitlabConfig(appid, appversion, environment);
    }
  }
}
