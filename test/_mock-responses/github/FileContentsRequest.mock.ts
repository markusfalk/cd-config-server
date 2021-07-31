import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { Config } from '../../../src/_interfaces/config.interface';
import { FileBlobGithub } from '../../../src/github/_interfaces/file-blob.interface';
import { HttpService } from '@nestjs/axios';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const btoa = require('btoa');
const mockBlobContent: Config = {
  compatibleWithAppVersion: '1.0.0',
  content: 'staging',
};

export function mockFileContentRequestGithub(
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

  const result: AxiosResponse<FileBlobGithub> = {
    data: {
      sha: '',
      node_id: '',
      size: 123,
      url: '',
      content: btoa(JSON.stringify(mockBlobContent)),
      encoding: '',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
