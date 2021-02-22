import { of } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigurationService } from '../configuration/configuration.service';
import { FileAccessService } from '../file-access/file-access.service';
import { SemanticVersioningService } from '../semantic-versioning/semantic-versioning.service';
import { FileSystemService } from './file-system.service';

function mockFileAccessService() {
  return {
    readFile: () => {
      return of({ testconfig: true });
    },
    readDirectory: () => of(['1.0.0']),
  };
}

describe('FileSystemService', () => {
  let service: FileSystemService;
  let fileAccessService: FileAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigurationService,
        FileSystemService,
        SemanticVersioningService,
        {
          provide: FileAccessService,
          useFactory: mockFileAccessService,
        },
      ],
    }).compile();

    service = module.get<FileSystemService>(FileSystemService);
    fileAccessService = module.get<FileAccessService>(FileAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Config[]', () => {
    const mockAppId = 'test-app';
    const mockEnvironment = 'test';

    service
      .getConfigFromFileSystem(mockAppId, mockEnvironment)
      .subscribe((response) => {
        expect(response).toEqual({ testconfig: true });
      });
  });
});
