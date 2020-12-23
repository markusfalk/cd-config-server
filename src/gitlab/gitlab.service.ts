import { AxiosRequestConfig } from 'axios';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';

import { Config } from '../_interfaces/config.interface';
import { ConfigurationService } from '../_services/configuration/configuration.service';

export interface GitlabProject {
  id: number;
  name: string;
  path: string;
}

export interface GitlabTag {
  commit: {
    id: string;
    short_id: string;
    title: string;
  };
  name: string;
}

export interface GitlabTree {
  id: string;
  name: string;
  path: string;
}

export interface ExtendedTree {
  data: GitlabTree[];
  ref: string;
}

@Injectable()
export class GitlabService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigurationService,
  ) {}

  private gitlabUserName = this.configService.getEnvironmentConfig(
    'GITLABUSERNAME',
  );

  private gitlabBaseUrl = 'https://gitlab.com/api/v4';
  private repoId: string;

  private getProjectId(username: string, appid: string): Observable<string> {
    const url = `https://gitlab.com/api/v4/users/${username}/projects`;

    return this.http.get<GitlabProject[]>(url).pipe(
      switchMap((response) => {
        return of(response.data);
      }),
      switchMap((projects) => {
        const filtered = projects.filter((project) => {
          return project.path.includes(appid);
        });
        if (filtered.length) {
          return of(filtered[0]);
        } else {
          const err = new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              error: `Could not find project '${appid}' for configured user.`,
            },
            HttpStatus.NOT_FOUND,
          );
          return throwError(err);
        }
      }),
      switchMap((project) => {
        const repoId = project.id.toString();
        this.repoId = repoId;
        return of(repoId);
      }),
    );
  }

  private getTags(repoId: string) {
    const url = `${this.gitlabBaseUrl}/projects/${repoId}/repository/tags`;
    return this.http.get<GitlabTag[]>(url).pipe(
      switchMap((response) => {
        return of(response.data);
      }),
    );
  }

  private loadTreeFromTag(tag: GitlabTag): Observable<ExtendedTree> {
    // https://gitlab.com/api/v4/projects/23240716/repository/tree?ref=9507479e

    const url = `${this.gitlabBaseUrl}/projects/${this.repoId}/repository/tree`;
    const ref = tag.commit.id;

    const config: AxiosRequestConfig = {
      params: {
        ref: ref,
      },
    };

    return this.http.get<GitlabTree[]>(url, config).pipe(
      switchMap((response) => {
        return of({
          data: response.data,
          ref,
        });
      }),
    );
  }

  private getTreesFromTags(tags: GitlabTag[]) {
    const allTrees: Observable<ExtendedTree>[] = [];

    tags.forEach((tag) => {
      const tree = this.loadTreeFromTag(tag);
      allTrees.push(tree);
    });

    return combineLatest([...allTrees]);
  }

  private filterTreesByEnvironment(environment: string, trees: ExtendedTree[]) {
    const allFiles: ExtendedTree[] = [];
    let error = false;

    trees.forEach((tree) => {
      const filtered = tree.data.filter((fileTree) => {
        return fileTree.path.includes(environment);
      });

      if (filtered.length) {
        allFiles.push({
          data: filtered,
          ref: tree.ref,
        });
      } else {
        error = true;
      }
    });

    if (error) {
      const err = new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Could not find ${environment}.json`,
        },
        HttpStatus.NOT_FOUND,
      );
      return throwError(err);
    } else {
      return of(allFiles);
    }
  }

  private loadFileContent(path: string, ref: string): Observable<Config> {
    const filePath = encodeURIComponent(path);
    const url = `${this.gitlabBaseUrl}/projects/${this.repoId}/repository/files/${filePath}/raw`;

    const config: AxiosRequestConfig = {
      params: {
        ref: ref,
      },
    };

    return this.http.get<Config>(url, config).pipe(
      switchMap((response) => {
        return of(response.data);
      }),
    );
  }

  private getFileContents(trees: ExtendedTree[]) {
    const allFiles: Observable<Config>[] = [];
    trees.forEach((tree) => {
      const path: string = tree.data[0].path;
      allFiles.push(this.loadFileContent(path, tree.ref));
    });
    return combineLatest([...allFiles]);
  }

  getConfigFromGitLab(
    appid: string,
    appversion: string,
    environment: string,
  ): Observable<Config[]> {
    return this.getProjectId(this.gitlabUserName, appid).pipe(
      // tap(console.log),
      switchMap((projectId) => {
        return this.getTags(projectId);
      }),
      // tap(console.log),
      switchMap((tags) => {
        return this.getTreesFromTags(tags);
      }),
      // tap(console.log),
      switchMap((trees) => {
        return this.filterTreesByEnvironment(environment, trees);
      }),
      // tap(console.log),
      switchMap((trees) => {
        return this.getFileContents(trees);
      }),
      // tap(console.log),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }
}
