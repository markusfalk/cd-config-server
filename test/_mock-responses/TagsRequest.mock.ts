import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { Tag } from 'src/_interfaces/tag.interface';

import { HttpService } from '@nestjs/common';

const response = [
  {
    node_id: '',
    object: {
      sha: 'abc',
      type: '',
      url: '',
    },
    ref: 'refs/tags/1.0.0',
    url: '',
  },
  {
    node_id: '',
    object: {
      sha: 'def',
      type: '',
      url: '',
    },
    ref: 'refs/tags/2.0.0',
    url: '',
  },
];

export function mockTagsResponse(httpService: HttpService) {
  const result: AxiosResponse<Tag[]> = {
    data: response,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
