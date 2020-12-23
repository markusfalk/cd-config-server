import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';

import { GitlabTag } from '../../../src/gitlab/gitlab.service';

const responseWithoutTags: GitlabTag[] = [];
const responseWithTags: GitlabTag[] = [
  {
    commit: {
      id: 'refone',
      short_id: 'one',
      title: 'one',
    },
    name: '1.0.0',
  },
  {
    commit: {
      id: 'reftwo',
      short_id: 'two',
      title: 'two',
    },
    name: '2.0.0',
  },
];

export function mockTagsResponseGitlab(
  httpService: HttpService,
  empty?: boolean,
) {
  const result: AxiosResponse<GitlabTag[]> = {
    data: empty ? responseWithoutTags : responseWithTags,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
