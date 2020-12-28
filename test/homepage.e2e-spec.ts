import { join } from 'path';
import * as request from 'supertest';

import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../src/app.endpoint/app.module';

describe('Homepage Endpoints (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useStaticAssets(join(__dirname, '..', 'src', '_assets'));
    app.setBaseViewsDir(join(__dirname, '..', 'src', '_views'));
    app.setViewEngine('hbs');
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
