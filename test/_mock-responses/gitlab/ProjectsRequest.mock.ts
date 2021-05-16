import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';

import { GitlabProject } from '../../../src/gitlab/gitlab/gitlab.service';

export function mockProjectsRequestGitlab(httpService: HttpService) {
  const result: AxiosResponse<GitlabProject[]> = {
    data: [
      {
        id: 1,
        name: 'project one',
        path: 'project-one-config',
      },
    ],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
