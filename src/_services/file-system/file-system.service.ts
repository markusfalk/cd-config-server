import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { Config } from '../../_interfaces/config.interface';
import { EnvironmentEntity } from '../../_interfaces/environment.entity.interface';
import { FileAccessService } from '../file-access/file-access.service';
import { SemanticVersioningService } from '../semantic-versioning/semantic-versioning.service';

@Injectable()
export class FileSystemService {
  private readonly logger = new Logger(FileSystemService.name);

  constructor(
    private readonly fileAccessService: FileAccessService,
    private readonly semverService: SemanticVersioningService,
  ) {}

  private getConfigVersions(appid: string): Observable<string[]> {
    return this.fileAccessService.readDirectory(appid);
    // TODO: error: `No configuration versions found. Is '${appid}' the correct app identifier?`,
  }

  private getFilesByEnvironment(
    appid: string,
    configVersions: string[],
  ): Observable<EnvironmentEntity[]> {
    const entityCollection: Observable<EnvironmentEntity>[] = [];
    configVersions.forEach((configVersion) => {
      const isVersionSemver = this.semverService.parseSemanticVersion(
        configVersion,
      );

      if (isVersionSemver) {
        const eEntity: Observable<EnvironmentEntity> = this.fileAccessService
          .readDirectory(`${appid}/${configVersion}`)
          .pipe(
            map((dir) => {
              const entity: EnvironmentEntity = {
                files: dir,
                configVersion,
              };
              return entity;
            }),
            catchError((err) => {
              return of(err);
            }),
          );
        entityCollection.push(eEntity);
      } else {
        // TODO: throw error? empty results? when version is not semver.
        const errorMessage = `The folder name '${configVersion}' is incompatible with semantic versioning. See https://semver.org for more details.`;
        const err = new HttpException(
          {
            status: HttpStatus.FAILED_DEPENDENCY,
            error: errorMessage,
          },
          HttpStatus.FAILED_DEPENDENCY,
        );
        this.logger.error(errorMessage);
        entityCollection.push(throwError(err));
      }
    });

    return forkJoin(entityCollection);
  }

  private getFileContents(
    appid: string,
    environment: string,
    environmentEntities: EnvironmentEntity[],
  ): Observable<Config[]> {
    const configCollection: Observable<Config>[] = [];
    const filename = `${environment}.json`;

    environmentEntities.forEach((entity) => {
      const path = `${appid}/${entity.configVersion}`;
      const tmpConfig: Observable<Config> = this.fileAccessService.readFile<Config>(
        path,
        filename,
      );

      configCollection.push(tmpConfig);
    });

    return forkJoin(configCollection);
  }

  getConfigFromFileSystem(
    appid: string,
    environment: string,
  ): Observable<Config[]> {
    return this.getConfigVersions(appid).pipe(
      switchMap((configVersions) => {
        return this.getFilesByEnvironment(appid, configVersions);
      }),
      switchMap((entities) => {
        return this.getFileContents(appid, environment, entities);
      }),
    );
  }
}
