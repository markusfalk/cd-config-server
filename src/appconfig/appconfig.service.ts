import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { satisfies } from 'semver';

import { Injectable } from '@nestjs/common';

import { Config } from '../_interfaces/config.interface';
import { GithubService } from '../github/github.service';

@Injectable()
export class AppConfigService {
  constructor(private readonly githubService: GithubService) {}

  private findMatchingFile(configFiles: Config[], appVersion: string) {
    const matched = configFiles.filter((file) => {
      if (file.compatibleWithAppVersion) {
        return satisfies(appVersion, file.compatibleWithAppVersion);
      } else {
        return throwError(
          `The config file must include the key  'compatibleWithAppVersion'`,
        );
      }
    });
    const last = matched[matched.length - 1];
    if (last) {
      return of(last);
    } else {
      return throwError(`No config found matching ${appVersion}`);
    }
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
      // tap(console.log), // tags
      switchMap((tagCollections) =>
        this.githubService.getTrees(tagCollections, appid),
      ),
      // tap(console.log), // trees
      switchMap((trees) =>
        this.githubService.findFileTreesFilteredByEnvironment(
          trees,
          environment,
        ),
      ),
      // tap(console.log), // files by environment
      switchMap((files) => this.githubService.getFileContents(files, appid)),
      // tap(console.log),
      switchMap((configFiles) =>
        this.findMatchingFile(configFiles, appversion),
      ),
      // tap(console.log),
    );
  }
}
