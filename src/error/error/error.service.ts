import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { throwError } from 'rxjs';
import { HandleHttpErrorOptions } from './_interfaces/handleHttpErrorOptions.interface';
import { LogLevel } from './_interfaces/LogLevel';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  private createHttpException(response: string, status: HttpStatus) {
    return new HttpException(response, status);
  }

  private handleLogger(logLevel: LogLevel, msg: string) {
    switch (logLevel) {
      case 'error':
        this.logger.error(msg);
        break;
      case 'warn':
        this.logger.warn(msg);
        break;
      default:
        this.logger.log(msg);
        break;
    }
  }

  handleHttpError(options: HandleHttpErrorOptions) {
    const err = this.createHttpException(
      options.errorMessage,
      options.httpStatus,
    );

    const logMessage = `
      ${options.httpStatus}: ${options.errorLog ?? options.errorMessage}
    `;

    this.handleLogger('error', logMessage);

    return throwError(err);
  }
}
