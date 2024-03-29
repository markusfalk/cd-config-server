import * as request from 'supertest';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../src/configuration/configuration/configuration.service';
import { AppModule } from '../src/app.endpoint/app.module';
import { mockFileContentRequestGitlab } from './_mock-responses/gitlab/FileContentsRequest.mock';
import { mockProjectsRequestGitlab } from './_mock-responses/gitlab/ProjectsRequest.mock';
import { mockTagsResponseGitlab } from './_mock-responses/gitlab/TagsRequest.mock';
import { mockTreesResponseGitlab } from './_mock-responses/gitlab/TreesRequest.mock';
import { mockConfigurationService } from './mockConfigurationService';
import { HttpModule, HttpService } from '@nestjs/axios';

const mockNodeEnvironmentVariables = {
  SOURCE: 'gitlab',
  GITLABUSERNAME: 'markus_falk',
  GITLAB_BASE_URL: 'https://gitlab.com/api/v4',
};

const gitlabBaseUrlExpected =
  mockNodeEnvironmentVariables.GITLAB_BASE_URL || 'https://gitlab.com/api/v4';

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
    const appid = 'project-one';
    const version = '1.0.0';
    const environment = 'development';

    // returns appID
    mockProjectsRequestGitlab(httpService);

    // returns 2 tags
    mockTagsResponseGitlab(httpService);

    // causes 1 trees per tag, returns 2 files per tree
    mockTreesResponseGitlab(httpService);
    mockTreesResponseGitlab(httpService);

    // mock files
    mockFileContentRequestGitlab(httpService, version, environment);
    mockFileContentRequestGitlab(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);

    // project
    expect(httpService.get).toHaveBeenCalledWith(
      `${gitlabBaseUrlExpected}/users/${mockNodeEnvironmentVariables.GITLABUSERNAME}/projects`,
    );

    // tags
    expect(httpService.get).toHaveBeenCalledWith(
      `${gitlabBaseUrlExpected}/projects/1/repository/tags`,
    );

    // trees
    expect(httpService.get).toHaveBeenCalledWith(
      `${gitlabBaseUrlExpected}/projects/1/repository/tree`,
      {
        params: { ref: 'refone' },
      },
    );

    expect(httpService.get).toHaveBeenCalledWith(
      `${gitlabBaseUrlExpected}/projects/1/repository/tree`,
      {
        params: { ref: 'reftwo' },
      },
    );

    // file contents
    expect(httpService.get).toHaveBeenCalledWith(
      `${gitlabBaseUrlExpected}/projects/1/repository/files/${environment}.json/raw`,
      { params: { ref: 'refone' } },
    );

    expect(httpService.get).toHaveBeenCalledWith(
      `${gitlabBaseUrlExpected}/projects/1/repository/files/${environment}.json/raw`,
      { params: { ref: 'reftwo' } },
    );

    expect(response.body).toEqual({
      compatibleWithAppVersion: version,
      content: environment,
    });
  });

  it('should filter by version (GET)', async () => {
    const appid = 'project-one';
    const version = '2.0.0';
    const environment = 'development';

    mockProjectsRequestGitlab(httpService);
    mockTagsResponseGitlab(httpService);
    mockTreesResponseGitlab(httpService);
    mockTreesResponseGitlab(httpService);
    mockFileContentRequestGitlab(httpService, version, environment);
    mockFileContentRequestGitlab(httpService, version, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${version}/${environment}`)
      .expect(200);

    expect(response.body).toEqual({
      compatibleWithAppVersion: version,
      content: environment,
    });
  });

  it('should filter by environment (GET)', async () => {
    const appid = 'project-one';
    const version = '1.0.0';
    const environment = 'staging';

    mockProjectsRequestGitlab(httpService);
    mockTagsResponseGitlab(httpService);
    mockTreesResponseGitlab(httpService);
    mockTreesResponseGitlab(httpService);
    mockFileContentRequestGitlab(httpService, version, environment);
    mockFileContentRequestGitlab(httpService, version, environment);

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
