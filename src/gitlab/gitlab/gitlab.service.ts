import { AxiosRequestConfig } from 'axios';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { Config } from '../../_interfaces/config.interface';
import { ConfigurationService } from '../../configuration/configuration/configuration.service';
import { ErrorService } from '../../error/error/error.service';

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
    private readonly errorService: ErrorService,
  ) {}

  private gitlabUserName =
    this.configService.getEnvironmentConfig('GITLABUSERNAME');

  private gitlabBaseUrl =
    this.configService.getEnvironmentConfig('GITLAB_BASE_URL') ||
    'https://gitlab.com/api/v4';

  private repoId: string;

  private getProjectId(username: string, appid: string): Observable<string> {
    if (!username) {
      return this.errorService.handleHttpError({
        errorMessage: `GITLABUSERNAME not configured`,
        httpStatus: HttpStatus.BAD_REQUEST,
      });
    }

    const url = `${this.gitlabBaseUrl}/users/${username}/projects`;

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
          return this.errorService.handleHttpError({
            errorMessage: `Could not find '${appid}-config' repository for configured user.`,
            httpStatus: HttpStatus.NOT_FOUND,
          });
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
      return this.errorService.handleHttpError({
        errorMessage: `Could not find ${environment}.json`,
        httpStatus: HttpStatus.NOT_FOUND,
      });
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
      switchMap((projectId) => {
        return this.getTags(projectId);
      }),
      switchMap((tags) => {
        return this.getTreesFromTags(tags);
      }),
      switchMap((trees) => {
        return this.filterTreesByEnvironment(environment, trees);
      }),
      switchMap((trees) => {
        return this.getFileContents(trees);
      }),
      catchError((err) => {
        return throwError(err);
      }),
    );
  }
}
