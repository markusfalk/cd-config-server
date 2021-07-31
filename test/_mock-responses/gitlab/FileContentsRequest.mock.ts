import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/axios';

import { Config } from '../../../src/_interfaces/config.interface';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockBlobContent: Config = {
  compatibleWithAppVersion: '1.0.0',
  content: 'staging',
};

export function mockFileContentRequestGitlab(
  httpService: HttpService,
  version?: string,
  environment?: string,
) {
  if (version) {
    mockBlobContent.compatibleWithAppVersion = version;
  }

  if (environment) {
    mockBlobContent.content = environment;
  }

  const result: AxiosResponse<Config> = {
    data: mockBlobContent,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
