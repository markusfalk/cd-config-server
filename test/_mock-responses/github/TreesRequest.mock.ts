import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';

import {
  mockTreeDevelopment,
  mockTreeStaging,
} from '../../_mock-services/mockTree';
import { Trees } from '../../../src/github/_interfaces/trees.interface';

export function mockTreesRequestGithub(httpService: HttpService) {
  const result: AxiosResponse<Trees> = {
    data: {
      sha: 'mocktrees',
      tree: [mockTreeStaging, mockTreeDevelopment],
      truncated: false,
      url: '',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
