import { of } from 'rxjs';
import { parse, satisfies } from 'semver';
import { Config } from 'src/_interfaces/config.interface';

import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ErrorService } from '../../error/error/error.service';
import { errorMessages } from './errorMessages.enum';

@Injectable()
export class SemanticVersioningService {
  constructor(private errorService: ErrorService) {}

  private readonly logger = new Logger(SemanticVersioningService.name);

  private filterConfigFilesWithSemanticVersioningProperty(
    configFiles: Config[],
    appVersion: string,
  ) {
    return configFiles.filter((file) => {
      return this.filterBySemanticVersioningKey(file, appVersion);
    });
  }

  private filterBySemanticVersioningKey(file: Config, appVersion: string) {
    if (file.compatibleWithAppVersion) {
      return satisfies(appVersion, file.compatibleWithAppVersion);
    } else {
      this.logger.error(`${errorMessages.missingKey}: ${JSON.stringify(file)}`);
      return false;
    }
  }

  private sortBySemanticVersion(configFiles: Config[]) {
    return configFiles.sort((a, b) => {
      return ('' + a.compatibleWithAppVersion).localeCompare(
        b.compatibleWithAppVersion,
      );
    });
  }

  /*
   * Checks the config attribute 'compatibleWithAppVersion' in an array of configs
   * then returns the highest matching config.
   */
  findMatchingFile(configFiles: Config[], appVersion: string) {
    if (!this.parseSemanticVersion(appVersion)) {
      const errorMessage = `${appVersion}: ${errorMessages.nonSemver}`;
      return this.errorService.handleHttpError({
        httpStatus: HttpStatus.BAD_REQUEST,
        errorMessage,
      });
    }

    const matched = this.filterConfigFilesWithSemanticVersioningProperty(
      configFiles,
      appVersion,
    );

    // need to sort to use last entry as highest matching version
    if (matched.length > 1) {
      this.sortBySemanticVersion(matched);
    }

    // return last value in case more than one config matches the appversion
    const last = matched[matched.length - 1];

    if (last) {
      return of(last);
    } else {
      const errorMessage = `${errorMessages.noConfig} ${appVersion}`;
      return this.errorService.handleHttpError({
        httpStatus: HttpStatus.NOT_FOUND,
        errorMessage,
      });
    }
  }

  parseSemanticVersion(version: string): boolean {
    return parse(version);
  }
}
