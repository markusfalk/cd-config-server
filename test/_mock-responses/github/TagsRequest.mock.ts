import { AxiosResponse, AxiosError } from 'axios';
import { of, throwError } from 'rxjs';

import { HttpException, HttpService } from '@nestjs/common';
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

export function mockTagsResponseGithubWithHttpError(httpService: HttpService) {
  // const error = new HttpException('foo error', 123);
  const error: Partial<AxiosError> = {
    code: '404',
    response: {
      status: 404,
      data: '',
      statusText: 'no no',
      headers: 'any',
      config: {},
    },
    isAxiosError: true,
  };

  jest
    .spyOn(httpService, 'get')
    .mockImplementationOnce(() => throwError(error));
}
