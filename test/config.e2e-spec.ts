import * as request from 'supertest';

import { HttpModule, HttpService, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { GithubService } from '../src/github/github.service';
import { mockFileContentRequest } from './_mock-responses/FileContentsRequest.mock';
import { mockRateLimitRequest } from './_mock-responses/RateLimitRequest.mock';
import { mockTagsResponse } from './_mock-responses/TagsRequest.mock';
import { mockTreesRequest } from './_mock-responses/TreesRequest.mock';

describe('Config Endpoints (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;
  let githubService: GithubService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    })
      // .overrideProvider(GithubService)
      // .useValue(mockGithubService)
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);
    githubService = moduleFixture.get<GithubService>(GithubService);

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
      .get('/appOne/1.0.0/staging')
      .expect(200);
    expect(response.body).toEqual({
      compatibleWithAppVersion: '1.0.0',
      content: 'development',
    });

    // const foo = jest.spyOn(githubService, 'getRemoteTags');
    // expect(foo).toHaveBeenCalled();
    // const foo = jest.fn();
    // expect(githubService.getRemoteTags).toHaveBeenCalled();
  });

  xit('should filter by version (GET)', async () => {
    mockRateLimitRequest(httpService);
    mockTagsResponse(httpService);

    mockTreesRequest(httpService);
    mockTreesRequest(httpService);

    mockFileContentRequest(httpService);
    mockFileContentRequest(httpService);

    const response = await request(app.getHttpServer())
      .get('/cd-config-server/2.0.0/staging')
      .expect(200);
    expect(response.body).toEqual({
      compatibleWithAppVersion: '2.0.0',
      content: 'staging',
    });
  });

  it('should filter by environment (GET)', async () => {
    mockRateLimitRequest(httpService);
    mockTagsResponse(httpService);

    mockTreesRequest(httpService);
    mockTreesRequest(httpService);

    mockFileContentRequest(httpService);
    mockFileContentRequest(httpService);

    const response = await request(app.getHttpServer())
      .get('/appTwo/1.0.0/development')
      .expect(200);
    expect(response.body).toEqual({
      compatibleWithAppVersion: '1.0.0',
      content: 'development',
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
