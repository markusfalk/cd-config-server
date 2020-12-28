import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';

import { GitlabTree } from '../../../src/_services/gitlab/gitlab.service';

const responseWithoutTrees: GitlabTree[] = [];
const responseWithTrees: GitlabTree[] = [
  {
    id: 'tree-one',
    name: 'tree one',
    path: 'development.json',
  },
  {
    id: 'tree-two',
    name: 'tree two',
    path: 'staging.json',
  },
];

export function mockTreesResponseGitlab(
  httpService: HttpService,
  empty?: boolean,
) {
  const result: AxiosResponse<GitlabTree[]> = {
    data: empty ? responseWithoutTrees : responseWithTrees,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
