import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { FileAccessService } from '../src/_services/file-access/file-access.service';

export function mockFileAccessResponse(
  fileAccessService: FileAccessService,
  environment: string,
) {
  jest
    .spyOn(fileAccessService, 'readDirectory')
    .mockImplementationOnce(() => of(['1.0.0', '2.0.0']));

  jest
    .spyOn(fileAccessService, 'readDirectory')
    .mockImplementationOnce(() =>
      of(['development.json', 'test.json', 'production.json']),
    );

  jest
    .spyOn(fileAccessService, 'readDirectory')
    .mockImplementationOnce(() =>
      of(['development.json', 'test.json', 'production.json']),
    );

  if (
    environment === 'development' ||
    environment === 'test' ||
    environment === 'production'
  ) {
    jest.spyOn(fileAccessService, 'readFile').mockImplementationOnce(() =>
      of({
        compatibleWithAppVersion: '^1.0.0',
        content: environment,
      }),
    );

    jest.spyOn(fileAccessService, 'readFile').mockImplementationOnce(() =>
      of({
        compatibleWithAppVersion: '^2.0.0',
        content: environment,
      }),
    );
  } else {
    jest.spyOn(fileAccessService, 'readFile').mockImplementationOnce(() => {
      const error = new HttpException(
        {
          message: `${environment}.json is not the environment you are looking for`,
          statusCode: 404,
        },
        404,
      );
      return throwError(error);
    });

    jest.spyOn(fileAccessService, 'readFile').mockImplementationOnce(() => {
      const error = new HttpException(
        {
          message: `${environment}.json is not the environment you are looking for`,
          statusCode: 404,
        },
        404,
      );
      return throwError(error);
    });
  }
}
