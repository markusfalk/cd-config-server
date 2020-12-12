import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/common';

export function mockRateLimitRequest(httpService: HttpService) {
  const result: AxiosResponse = {
    data: {
      rate: 123,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
  jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));
}
