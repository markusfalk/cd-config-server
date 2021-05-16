import * as request from 'supertest';

import { HttpModule, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../src/configuration/configuration/configuration.service';
import { FileAccessService } from '../src/filesystem/file-access/file-access.service';
import { AppModule } from '../src/app.endpoint/app.module';
import { mockConfigurationService } from './mockConfigurationService';
import { mockFileAccessResponse } from './mockFileAccessResponse';

const mockNodeEnvironmentVariables = {
  SOURCE: 'filesystem',
};

describe('Config Endpoints (e2e)', () => {
  let app: INestApplication;
  let fileAccessService: FileAccessService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
    })
      .overrideProvider(ConfigurationService)
      .useValue(mockConfigurationService(mockNodeEnvironmentVariables))
      .compile();

    app = moduleFixture.createNestApplication();
    fileAccessService = moduleFixture.get<FileAccessService>(FileAccessService);

    await app.init();
  });

  it('should filter by appid', async () => {
    const appid = 'appOne';
    const appVersion = '1.0.0';
    const environment = 'development';

    mockFileAccessResponse(fileAccessService, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${appVersion}/${environment}`)
      .expect(200);

    expect(response.body).toEqual({
      compatibleWithAppVersion: '^1.0.0',
      content: environment,
    });
  });

  it('should return error on unknown appid', async () => {
    const appid = 'unknown';
    const appVersion = '1.0.0';
    const environment = 'development';

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${appVersion}/${environment}`)
      .expect(404);

    expect(response.body).toEqual({
      message: 'No configuration versions found',
      statusCode: 404,
    });
  });

  it('should filter by appversion', async () => {
    const appid = 'appOne';
    const appVersion = '2.0.0';
    const environment = 'development';

    mockFileAccessResponse(fileAccessService, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${appVersion}/${environment}`)
      .expect(200);

    expect(response.body).toEqual({
      compatibleWithAppVersion: '^2.0.0',
      content: environment,
    });
  });

  it('should error on incompatible version', async () => {
    const appid = 'appOne';
    const appVersion = '555.0.0';
    const environment = 'development';

    mockFileAccessResponse(fileAccessService, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${appVersion}/${environment}`)
      .expect(404);

    expect(response.body).toEqual({
      message: `Could not find config file that is compatible with app version ${appVersion}`,
      statusCode: 404,
    });
  });

  it('should error on unknown environment', async () => {
    const appid = 'appOne';
    const appVersion = '1.0.0';
    const environment = 'unknown';

    mockFileAccessResponse(fileAccessService, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${appVersion}/${environment}`)
      .expect(404);

    expect(response.body).toEqual({
      message: `${environment}.json is not the environment you are looking for`,
      statusCode: 404,
    });
  });

  it('should filter by environment', async () => {
    const appid = 'appOne';
    const appVersion = '1.0.0';
    const environment = 'production';

    mockFileAccessResponse(fileAccessService, environment);

    const response = await request(app.getHttpServer())
      .get(`/${appid}/${appVersion}/${environment}`)
      .expect(200);

    expect(response.body).toEqual({
      compatibleWithAppVersion: '^1.0.0',
      content: environment,
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
