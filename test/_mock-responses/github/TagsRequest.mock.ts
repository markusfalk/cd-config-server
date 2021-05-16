import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';
import { Tag } from 'src/github/_interfaces/tag.interface';

const responseWithoutTags = [];
const responseWithTags = [
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

export function mockTagsResponseGithub(
  httpService: HttpService,
  empty?: boolean,
) {
  const result: AxiosResponse<Tag[]> = {
    data: empty ? responseWithoutTags : responseWithTags,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
