import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';

import { Trees } from '../src/_interfaces/trees.interface';
import { mockTreeDevelopment, mockTreeStaging } from './_mock-services/mockTree';

export function mockTreesRequest(httpService: HttpService) {
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
