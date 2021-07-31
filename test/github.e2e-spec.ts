import * as request from 'supertest';

import {
  HttpException,
  HttpModule,
  HttpService,
  INestApplication,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../src/configuration/configuration/configuration.service';
import { AppModule } from '../src/app.endpoint/app.module';
import { mockFileContentRequestGithub } from './_mock-responses/github/FileContentsRequest.mock';
import {
  mockTagsResponseGithub,
  mockTagsResponseGithubWithHttpError,
} from './_mock-responses/github/TagsRequest.mock';
import { mockTreesRequestGithub } from './_mock-responses/github/TreesRequest.mock';
import { mockConfigurationService } from './mockConfigurationService';

const mockNodeEnvironmentVariables = {
  SOURCE: 'github',
  GITHUBPASSWORD: 'abc',
  GITHUBUSERNAME: 'markusfalk',
  USERAGENT: 'markusfalk',
};

describe('Config Endpoints (e2e)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    })
      .overrideProvider(ConfigurationService)
      .useValue(mockConfigurationService(mockNodeEnvironmentVariables))
      .compile();

    app = moduleFixture.createNestApplication();
    httpService = moduleFixture.get<HttpService>(HttpService);

    await app.init();
  });

  it('should filter by appid (GET)', async () => {
    const appid = 'appOne';
    const version = '1.0.0';
    const environment = 'development';

    // returns 2 tags
    mockTagsResponseGithub(httpService);

    // causes 1 trees per tag, returns 2 files per tree
    mockTreesRequestGithub(httpService);
    mockTreesRequestGithub(httpService);

    mockFileContentRequestGithub(httpService, version, environment);
    mockFileContentRequestGithub(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);

    // tags
    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${mockNodeEnvironmentVariables.GITHUBUSERNAME}/${appid}-config/git/refs/tags`,
      expect.anything(),
    );

    // trees
    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${mockNodeEnvironmentVariables.GITHUBUSERNAME}/${appid}-config/git/trees/abc`,
      expect.anything(),
    );

    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${mockNodeEnvironmentVariables.GITHUBUSERNAME}/${appid}-config/git/trees/def`,
      expect.anything(),
    );

    // file contents
    expect(httpService.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${mockNodeEnvironmentVariables.GITHUBUSERNAME}/${appid}-config/git/blobs/development`,
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

    mockTagsResponseGithub(httpService);

    mockTreesRequestGithub(httpService);
    mockTreesRequestGithub(httpService);

    mockFileContentRequestGithub(httpService, version, environment);
    mockFileContentRequestGithub(httpService, version, environment);

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

    mockTagsResponseGithub(httpService);

    mockTreesRequestGithub(httpService);
    mockTreesRequestGithub(httpService);

    mockFileContentRequestGithub(httpService, version, environment);
    mockFileContentRequestGithub(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);
    expect(response.body).toEqual({
      compatibleWithAppVersion: version,
      content: environment,
    });
  });

  // TODO: how???
  // it('should throw error on unkown repository', async () => {
  //   const appid = 'unknown';
  //   const version = '1.0.0';
  //   const environment = 'test';

  //   mockTagsResponseGithubWithHttpError(httpService);

  //   const response = await request(app.getHttpServer())
  //     .get(`/${appid}/${version}/${environment}`)
  //     .expect(404);
  //   expect(response).toBeInstanceOf(HttpException);
  //   // expect(response).toEqual('foooooooo');
  // });

  // it('should throw error on unkown app version', () => {});

  // it('should throw error on unkown app environment', () => {});

  afterAll(async () => {
    await app.close();
  });
});
