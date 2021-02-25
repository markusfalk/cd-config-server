import { of } from 'rxjs';

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
}
