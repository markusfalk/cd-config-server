import { atob } from 'atob';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';

import { Config } from '../_interfaces/config.interface';
import { FileBlobGithub } from '../_interfaces/file-blob.interface';
import { TagCollection } from '../_interfaces/tag-collection.interface';
import { Tag } from '../_interfaces/tag.interface';
import { Tree } from '../_interfaces/tree.interface';
import { Trees } from '../_interfaces/trees.interface';
import { ConfigurationService } from '../_services/configuration/configuration.service';

@Injectable()
export class GithubService {
  constructor(
    private configService: ConfigurationService,
    private readonly http: HttpService,
  ) {}

  private githubUserName = this.configService.getEnvironmentConfig(
    'GITHUBUSERNAME',
  );

  private githubPassword = this.configService.getEnvironmentConfig(
    'GITHUBPASSWORD',
  );

  private auth =
    'Basic ' +
    Buffer.from(this.githubUserName + ':' + this.githubPassword).toString(
      'base64',
    );

  private config = {
    headers: {
      'User-Agent': this.configService.getEnvironmentConfig('USERAGENT'),
      'Content-Type': 'application/json',
      Authorization: this.auth,
    },
  };

  private loadTreeFromHash(
    tagCollection: TagCollection,
    appid: string,
  ): Observable<Tree[]> {
    const collection = Object.values(tagCollection)[0];
    const url = `https://api.github.com/repos/${this.githubUserName}/${appid}-config/git/trees/${collection}`;
    return this.http
      .get<Trees>(url, this.config)
      .pipe(switchMap((response) => of(response.data.tree)));
  }

  private loadFileContent(hash: string, appid: string): Observable<Config> {
    const url = `https://api.github.com/repos/${this.githubUserName}/${appid}-config/git/blobs/${hash}`;
    return this.http
      .get<FileBlobGithub>(url, this.config)
      .pipe(
        switchMap((response) => of(JSON.parse(atob(response.data.content)))),
      );
  }

  private getRemoteTags(repo: string): Observable<TagCollection[]> {
    const url = `https://api.github.com/repos/${this.githubUserName}/${repo}-config/git/refs/tags`;
    return this.http.get<Tag[]>(url, this.config).pipe(
      switchMap((response) => {
        const tags = response.data.map((tag: Tag) => {
          const obj: TagCollection = {};
          const ref = tag.ref.replace('refs/tags/', '');
          const sha = tag.object.sha;
          obj[ref] = sha;
          return obj;
        });

        if (tags.length) {
          return of(tags);
        } else {
          const err = new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `No tags found in repo ${repo}`,
            },
            HttpStatus.NOT_FOUND,
          );

          return throwError(err);
        }
      }),
    );
  }

  private getTrees(
    tagCollections: TagCollection[],
    appid: string,
  ): Observable<Tree[][]> {
    const allTrees: Observable<Tree[]>[] = [];
    tagCollections.forEach((tag) => {
      const tree = this.loadTreeFromHash(tag, appid);
      allTrees.push(tree);
    });
    return combineLatest([...allTrees]);
  }

  private findFileTreesFilteredByEnvironment(
    trees: Tree[][],
    environment: string,
  ) {
    const allFiles: Tree[][] = [];

    trees.forEach((tree) => {
      const filtered = tree.filter((fileTree) => {
        return fileTree.path.includes(environment);
      });

      if (filtered.length) {
        allFiles.push(filtered);
      }
    });

    return of(allFiles);
  }

  private getFileContents(trees: Tree[][], appid: string) {
    const allFiles: Observable<Config>[] = [];
    trees.forEach((tree) => {
      const sha: string = tree[0].sha;
      allFiles.push(this.loadFileContent(sha, appid));
    });
    return combineLatest([...allFiles]);
  }

  getConfigFromGithub(appid: string, appversion: string, environment: string) {
    return this.getRemoteTags(appid).pipe(
      // tap(console.log), // tags
      switchMap((tagCollections) => this.getTrees(tagCollections, appid)),
      // tap(console.log), // trees
      switchMap((trees) =>
        this.findFileTreesFilteredByEnvironment(trees, environment),
      ),
      // tap(console.log), // files by environment
      switchMap((files) => this.getFileContents(files, appid)),
      // tap(console.log),
    );
  }
}
