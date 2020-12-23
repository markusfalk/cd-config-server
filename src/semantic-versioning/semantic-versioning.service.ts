import { of, throwError } from 'rxjs';
import { satisfies } from 'semver';
import { Config } from 'src/_interfaces/config.interface';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

export const enum errorsMessages {
  wrongKey = `The config file must include the key 'compatibleWithAppVersion'`,
  noConfig = `Could not find config file that is compatible with app version`,
}

@Injectable()
export class SemanticVersioningService {
  /*
   * Checks the config attribute 'compatibleWithAppVersion' in an array of configs
   * then returns the highest matching config.
   */
  findMatchingFile(configFiles: Config[], appVersion: string) {
    let attributeError = false;
    const matched = configFiles.filter((file) => {
      if (file.compatibleWithAppVersion) {
        return satisfies(appVersion, file.compatibleWithAppVersion);
      } else {
        attributeError = true;
      }
    });

    if (attributeError) {
      const err = new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: errorsMessages.wrongKey,
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
      return throwError(err);
    }

    // need to sort to use last entry as highest matching version
    if (matched.length > 1) {
      matched.sort((a, b) => {
        return ('' + a.compatibleWithAppVersion).localeCompare(
          b.compatibleWithAppVersion,
        );
      });
    }

    // return last value in case more than one config matches the appversion
    const last = matched[matched.length - 1];
    if (last) {
      return of(last);
    } else {
      const err = new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: errorsMessages.noConfig + ` ${appVersion}`,
        },
        HttpStatus.NOT_FOUND,
      );
      return throwError(err);
    }
  }
}
