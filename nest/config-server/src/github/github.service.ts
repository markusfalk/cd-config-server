import { atob } from 'atob';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { HttpService, Injectable } from '@nestjs/common';

const config = {
  headers: {
    'User-Agent': 'markusfalk',
    'Content-Type': 'application/json',
  },
};

@Injectable()
export class GithubService {

  constructor(private readonly http: HttpService) {}

  private loadTreeFromHash(hash: string) {
    hash = Object.values(hash)[0];
    const url = `https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/trees/${hash}`;
    return this.http
      .get(url)
      .pipe(switchMap((response) => of(response.data.tree)));
  }

  getRemoteTags() {
    const url = `https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/refs/tags`;
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

  getTrees(tags: any) {
    const allTags = [];
    tags.forEach((element) => {
      allTags.push(this.loadTreeFromHash(element));
    });
    return combineLatest([...allTags]);
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

  private loadFileContent(hash: string) {
    const url = `https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/blobs/${hash}`;
    return this.http
      .get(url)
      .pipe(
        switchMap((response) => of(JSON.parse(atob(response.data.content)))),
      );
  }

  getFileContents(files: { [index: string]: any }[][]) {
    const allFiles = [];
    console.log('###', files);
    files.forEach((file) => {
      const sha: string = file[0].sha;
      allFiles.push(this.loadFileContent(sha));
    });
    return combineLatest([...allFiles]);
  }

}
