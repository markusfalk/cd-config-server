import * as request from 'supertest';

import { HttpModule, HttpService, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.module';
import { GithubService } from '../src/github/github.service';
import { mockFileContentRequest } from './_mock-responses/FileContentsRequest.mock';
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

  it('should filter by appid (GET)', async () => {

    const appid = 'appOne';
    const version = '1.0.0';
    const environment = 'development';

    // returns 2 tags
    mockTagsResponse(httpService);

    // causes 1 trees per tag, returns 2 files per tree
    mockTreesRequest(httpService);
    mockTreesRequest(httpService);

    mockFileContentRequest(httpService, version, environment);
    mockFileContentRequest(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);

    // tags
    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/refs/tags`,
      expect.anything(),
    );

    // trees
    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/trees/abc`,
      expect.anything(),
    );

    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/trees/def`,
      expect.anything(),
    );

    // file contents
    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/blobs/development`,
      expect.anything(),
    );

    expect(response.body).toEqual({
      compatibleWithAppVersion: version,
      content: environment,
    });
  });

  it('should filter by version (GET)', async () => {

    const appid = 'appTwo';
    const version = '2.0.0';
    const environment = 'development';

    mockTagsResponse(httpService);

    mockTreesRequest(httpService);
    mockTreesRequest(httpService);

    mockFileContentRequest(httpService, version, environment);
    mockFileContentRequest(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);

    expect(response.body).toEqual({
      compatibleWithAppVersion: '2.0.0',
      content: 'development',
    });

  });

  it('should filter by environment (GET)', async () => {

    const appid = 'appTwo';
    const version = '2.0.0';
    const environment = 'staging';

    mockTagsResponse(httpService);

    mockTreesRequest(httpService);
    mockTreesRequest(httpService);

    mockFileContentRequest(httpService, version, environment);
    mockFileContentRequest(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);
    expect(response.body).toEqual({
      compatibleWithAppVersion: version,
      content: environment,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
