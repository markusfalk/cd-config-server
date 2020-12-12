import * as request from 'supertest';

import { HttpModule, HttpService, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { mockFileContentRequest } from './FileContentsRequest.mock';
import { mockRateLimitRequest } from './RateLimitRequest.mock';
import { mockTagsResponse } from './TagsRequest.mock';
import { mockTreesRequest } from './TreesRequest.mock';

describe('Config Endpoints (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    })
      // .overrideProvider(GithubService)
      // .useValue(mockGithubService)
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);

    await app.init();
  });

  fit('should filter by appid (GET)', async () => {
    mockRateLimitRequest(httpService);
    mockTagsResponse(httpService);

    mockTreesRequest(httpService);
    mockTreesRequest(httpService);

    mockFileContentRequest(httpService);
    mockFileContentRequest(httpService);

    const response = await request(app.getHttpServer())
      .get('/cd-config-server/1.0.0/staging')
      .expect(200);
    expect(response.body).toEqual({
      compatibleWithAppVersion: '1.0.0',
      content: 'foo',
    });
  });

  // it('should filter by version (GET)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/cd-config-server/1.0.0/test')
  //     .expect(200);
  //   expect(response.body).not.toEqual({ compatibleWithAppVersion: '2.0.0' });
  //   expect(response.body).toEqual({ compatibleWithAppVersion: '1.0.0' });
  // });

  // it('should filter by environment (GET)', async () => {
  //   const response = await request(app.getHttpServer())
  //     .get('/cd-config-server/1.0.0/test')
  //     .expect(200);
  //   expect(response.body).not.toEqual({ compatibleWithAppVersion: '2.0.0' });
  //   expect(response.body).toEqual({ compatibleWithAppVersion: '1.0.0' });
  // });

  afterAll(async () => {
    await app.close();
  });
});
