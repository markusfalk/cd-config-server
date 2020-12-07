import { atob } from 'atob';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpService, Injectable } from '@nestjs/common';

import { Config } from '../_interfaces/config.interface';
import { Tags } from '../_interfaces/tag.interface';
import { Tree } from '../_interfaces/tree.interface';
import { ConfigurationService } from '../_services/configuration/configuration.service';

@Injectable()
export class GithubService {
  constructor(
    private configService: ConfigurationService,
    private readonly http: HttpService,
  ) {}

  private config = {
    headers: {
      'User-Agent': this.configService.getEnvironmentConfig('USERAGENT'),
      'Content-Type': 'application/json',
    },
  };

  private loadTreeFromHash(hash: Tags, appid: string): Observable<Tree[]> {
    hash = Object.values(hash)[0];
    const githubUserName = this.configService.getEnvironmentConfig(
      'GITHUBUSERNAME',
    );
    const url = `https://api.github.com/repos/${githubUserName}/${appid}-config/git/trees/${hash}`;
    return this.http
      .get<Tree>(url, this.config)
      .pipe(switchMap((response) => of(response.data.tree)));
  }

  getRemoteTags(repo: string) {
    const githubUserName = this.configService.getEnvironmentConfig(
      'GITHUBUSERNAME',
    );
    const url = `https://api.github.com/repos/${githubUserName}/${repo}-config/git/refs/tags`;
    return this.http.get(url, this.config).pipe(
      switchMap((response) => {
        const tags = response.data.map((tag: Tags) => {
          const obj = {};
          const ref = (tag.ref as string).replace('refs/tags/', '');
          const sha = tag.object.sha;
          obj[ref] = sha;
          return obj;
        });
        return of(tags);
      }),
    );
  }

  getTrees(tags: Tags[], appid: string): Observable<Tree[][]> {
    const allTrees: Observable<Tree[]>[] = [];
    tags.forEach((tag) => {
      allTrees.push(this.loadTreeFromHash(tag, appid));
    });
    return combineLatest([...allTrees]);
  }

  findFileInTrees(trees: { [index: string]: any }[][], environment: string) {
    const allFiles = [];
    trees.forEach((tree) => {
      const filtered = tree.filter((file) => {
        return (file.path as string).includes(environment);
      });
      allFiles.push(filtered);
    });
    return of(allFiles);
  }

  private loadFileContent(hash: string, appid: string): Observable<Config> {
    const githubUserName = this.configService.getEnvironmentConfig(
      'GITHUBUSERNAME',
    );
    const url = `https://api.github.com/repos/${githubUserName}/${appid}-config/git/blobs/${hash}`;
    return this.http
      .get<Config>(url, this.config)
      .pipe(
        switchMap((response) => of(JSON.parse(atob(response.data.content)))),
      );
  }

  getFileContents(files: { [index: string]: any }[][], appid: string) {
    const allFiles: Observable<Config>[] = [];
    files.forEach((file) => {
      const sha: string = file[0].sha;
      allFiles.push(this.loadFileContent(sha, appid));
    });
    return combineLatest([...allFiles]);
  }
}
