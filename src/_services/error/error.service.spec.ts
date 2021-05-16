import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorService],
    }).compile();

    service = module.get<ErrorService>(ErrorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', (done) => {
    const err = service.handleHttpError({
      errorMessage: 'test error',
      httpStatus: 400,
    });

    err.subscribe({
      error: (error: HttpException) => {
        expect(error.getResponse()).toEqual('test error');
        expect(error.getStatus()).toEqual(400);
        done();
      },
    });
  });
});
