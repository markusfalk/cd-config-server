import { of, throwError } from 'rxjs';
import { satisfies } from 'semver';
import { Config } from 'src/_interfaces/config.interface';

import { Injectable } from '@nestjs/common';

// export interface SemanticError {
//   appversion: string;
//   code: number;
//   message: string;
// }

// const wrongKeyError: SemanticError = {
//   appversion: ${appVersion},
//   code: 400,
//   message:
// }

export const enum errorsMessages {
  wrongKey = `The config file must include the key 'compatibleWithAppVersion'`,
  noConfig = `No config found matching`,
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
      return throwError(errorsMessages.wrongKey);
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
      return throwError(errorsMessages.noConfig + ` ${appVersion}`);
    }
  }
}
