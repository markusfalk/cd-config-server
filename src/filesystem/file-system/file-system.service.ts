import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { Config } from '../../_interfaces/config.interface';
import { EnvironmentEntity } from '../../_interfaces/environment.entity.interface';
import { FileAccessService } from '../file-access/file-access.service';
import { ErrorService } from '../../error/error/error.service';
import { SemanticVersioningService } from '../../semantic-versioning/semantic-versioning/semantic-versioning.service';

@Injectable()
export class FileSystemService {
  private readonly logger = new Logger(FileSystemService.name);

  constructor(
    private readonly fileAccessService: FileAccessService,
    private readonly semverService: SemanticVersioningService,
    private readonly errorService: ErrorService,
  ) {}

  /**
   * Get all available folders that represent a specific configuration version
   */
  private getConfigVersions(appid: string): Observable<string[]> {
    return this.fileAccessService.readDirectory(appid);
  }

  private createEnviromentEntityInFolder(appid: string, configVersion: string) {
    return this.fileAccessService
      .readDirectory(`${appid}/${configVersion}`)
      .pipe(
        map<string[], EnvironmentEntity>((dir) => {
          return {
            files: dir,
            configVersion,
          };
        }),
      );
  }

  /**
   * Get all available environments represented by a json file for each configuration version
   */
  private getFilesByEnvironment(
    appid: string,
    configVersions: string[],
  ): Observable<EnvironmentEntity[]> {
    const entityCollection: Observable<EnvironmentEntity>[] = [];

    configVersions.forEach((configVersion) => {
      if (!this.semverService.parseSemanticVersion(configVersion)) {
        const errorMessage = `The folder name '${configVersion}' is incompatible with semantic versioning. See https://semver.org for more details.`;
        this.errorService.handleHttpError({
          httpStatus: HttpStatus.FAILED_DEPENDENCY,
          errorMessage,
          logLevel: 'warn',
        });
      }

      const environmentEntity: Observable<EnvironmentEntity> = this.createEnviromentEntityInFolder(
        appid,
        configVersion,
      );

      entityCollection.push(environmentEntity);
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
