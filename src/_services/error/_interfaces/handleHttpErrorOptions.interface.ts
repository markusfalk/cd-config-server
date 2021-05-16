import { HttpStatus } from '@nestjs/common';
import { LogLevel } from './LogLevel';

export interface HandleHttpErrorOptions {
  /*
   * Will be shown to user.
   */
  errorMessage: string;

  /*
   * Will be shown in log.
   */
  errorLog?: string;

  httpStatus: HttpStatus;

  logLevel?: LogLevel;
}
