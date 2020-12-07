import { atob } from 'atob';
import { combineLatest, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Tree } from 'src/_interfaces/tree.interface';

import { HttpService, Injectable } from '@nestjs/common';

import { Config } from '../../dist/_interfaces/config.interface';
import { Tags } from '../../dist/_interfaces/tag.interface';

const config = {
  headers: {
    'User-Agent': 'markusfalk',
    'Content-Type': 'application/json',
  },
};

@Injectable()
export class GithubService {

  constructor(private readonly http: HttpService) {}

  private loadTreeFromHash(hash: string): Observable<Tree[]> {
    hash = Object.values(hash)[0];
    const url = `https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/trees/${hash}`;
    return this.http
      .get<Tree>(url)
      .pipe(switchMap((response) => of(response.data.tree)));
  }

  getRemoteTags(repo: string) {
    const url = `https://api.github.com/repos/markusfalk/${repo}-config/git/refs/tags`;
    return this.http.get(url, config).pipe(
      switchMap((response) => {
        const tags = response.data.map((tag) => {
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

  getTrees(tags: Tags[]): Observable<Tree[][]> {
    const allTrees: Observable<Tree[]>[] = [];
    tags.forEach((element) => {
      allTrees.push(this.loadTreeFromHash(element.hash));
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

  private loadFileContent(hash: string): Observable<Config> {
    const url = `https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/blobs/${hash}`;
    return this.http
      .get<Config>(url)
      .pipe(
        switchMap((response) => of(JSON.parse(atob(response.data.content)))),
      );
  }

  getFileContents(files: { [index: string]: any }[][]) {
    const allFiles: Observable<Config>[] = [];
    files.forEach((file) => {
      const sha: string = file[0].sha;
      allFiles.push(this.loadFileContent(sha));
    });
    return combineLatest([...allFiles]);
  }

}
