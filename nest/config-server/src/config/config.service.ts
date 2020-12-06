import { switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@nestjs/common';

import { GithubService } from '../github/github.service';

@Injectable()
export class ConfigService {

  constructor(private readonly githubService: GithubService) {}

  /*
   * ☑ load all tags from github
   * ☑ use hashes from tags to load trees
   * ☐ load file content from tree entries
   * ☐ find environment matching config file for each tag
   * ☐ find config matching app version
   */
  getApi(appid: string, appversion: string, environment: string) {
    return this.githubService.getRemoteTags().pipe(
      tap(console.log), // tags: ☑
      switchMap((tags) => this.githubService.getTrees(tags)),
      tap(console.log), // trees ☑
      switchMap((trees) =>
        this.githubService.findFileInTrees(trees, environment),
      ),
      tap(console.log), // files ☑
      switchMap((files) => this.githubService.getFileContents(files)),
      tap(console.log), // file contents
    );
  }
}
