import { of } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigurationModule } from '../../../configuration/configuration.module';
import { ErrorModule } from '../../../error/error.module';
import { SemanticVersioningModule } from '../../../semantic-versioning/semantic-versioning.module';
import { FileAccessService } from '../file-access/file-access.service';
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule, ErrorModule, SemanticVersioningModule],
      providers: [
        FileSystemService,
        {
          provide: FileAccessService,
          useFactory: mockFileAccessService,
        },
      ],
    }).compile();

    service = module.get<FileSystemService>(FileSystemService);
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
        expect(response).toEqual([{ testconfig: true }]);
      });
  });
});
