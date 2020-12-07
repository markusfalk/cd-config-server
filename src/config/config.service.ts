import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { satisfies } from 'semver';

import { Injectable } from '@nestjs/common';

import { Config } from '../_interfaces/config.interface';
import { GithubService } from '../github/github.service';

@Injectable()
export class ConfigService {
  constructor(private readonly githubService: GithubService) {}

  private findMatchingFile(configFiles: Config[], appVersion: string) {
    const matched = configFiles.filter((file) => {
      return satisfies(appVersion, file.compatibleWithAppVersion);
    });
    const last = matched[matched.length - 1];
    return of(last);
  }

  /*
   * ☑ load all tags from github
   * ☑ use hashes from tags to load trees
   * ☑ load file content from tree entries
   * ☑ find environment matching config file for each tag
   * ☑ find config matching app version
   */
  getApi(appid: string, appversion: string, environment: string) {
    return this.githubService.getRemoteTags(appid).pipe(
      switchMap((tags) => this.githubService.getTrees(tags, appid)),
      switchMap((trees) =>
        this.githubService.findFileInTrees(trees, environment),
      ),
      switchMap((files) => this.githubService.getFileContents(files, appid)),
      switchMap((configFiles) =>
        this.findMatchingFile(configFiles, appversion),
      ),
    );
  }
}
