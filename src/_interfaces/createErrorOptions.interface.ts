import { HttpStatus } from '@nestjs/common';

export interface createErrorOptions {
  /*
   * Will be shown to user.
   */
  errorMessage: string;

  /*
   * Will be shown in log.
   */
  errorLog?: string;

  httpStatus: HttpStatus;
}
