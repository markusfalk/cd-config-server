import { Test, TestingModule } from '@nestjs/testing';

import { Config } from '../_interfaces/config.interface';
import {
  errorsMessages,
  SemanticVersioningService,
} from './semantic-versioning.service';

describe('SemanticVersioningService', () => {
  let service: SemanticVersioningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemanticVersioningService],
    }).compile();

    service = module.get<SemanticVersioningService>(SemanticVersioningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should match specific version', () => {
    const configs: Config[] = [
      { compatibleWithAppVersion: '1.0.0' },
      { compatibleWithAppVersion: '2.0.0' },
      { compatibleWithAppVersion: '3.0.0' },
    ];

    service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
      expect(response).toEqual(configs[0]);
    });

    service.findMatchingFile(configs, '2.0.0').subscribe((response) => {
      expect(response).toEqual(configs[1]);
    });

    service.findMatchingFile(configs, '3.0.0').subscribe((response) => {
      expect(response).toEqual(configs[2]);
    });
  });

  it('should return error on wrong config key', () => {
    const configs: any[] = [{ wrongKey: '1.0.0' }];

    service.findMatchingFile(configs, '1.0.0').subscribe(
      () => console.log(),
      (error) => {
        expect(error).toBe(errorsMessages.wrongKey);
      },
    );
  });

  it('should throw error on empty results', () => {
    const configs: Config[] = [{ compatibleWithAppVersion: '1.0.0' }];

    service.findMatchingFile(configs, '2.0.0').subscribe(
      () => console.log(),
      (error) => {
        expect(error).toBe(errorsMessages.noConfig + ` 2.0.0`);
      },
    );
  });

  it('should match ^', () => {
    const configs: Config[] = [
      { compatibleWithAppVersion: '^2.0.0' }, // 0
      { compatibleWithAppVersion: '^2.1.0' }, // 1
      { compatibleWithAppVersion: '^2.1.1' }, // 2

      { compatibleWithAppVersion: '^1.2.1' }, // 3
      { compatibleWithAppVersion: '^1.1.0' }, // 4
      { compatibleWithAppVersion: '^1.3.1' }, // 5
      { compatibleWithAppVersion: '^1.0.0' }, // 6
      { compatibleWithAppVersion: '^1.2.0' }, // 7
      { compatibleWithAppVersion: '^1.1.1' }, // 8

      { compatibleWithAppVersion: '^3.1.1' }, // 9
      { compatibleWithAppVersion: '^3.0.0' }, // 10
      { compatibleWithAppVersion: '^3.1.0' }, // 11
    ];

    service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
      expect(response).toEqual(configs[6]);
    });

    service.findMatchingFile(configs, '1.1.0').subscribe((response) => {
      expect(response).toEqual(configs[4]);
    });

    service.findMatchingFile(configs, '2.0.0').subscribe((response) => {
      expect(response).toEqual(configs[0]);
    });

    service.findMatchingFile(configs, '2.0.1').subscribe((response) => {
      expect(response).toEqual(configs[0]);
    });

    service.findMatchingFile(configs, '3.0.0').subscribe((response) => {
      expect(response).toEqual(configs[10]);
    });

    service.findMatchingFile(configs, '3.0.1').subscribe((response) => {
      expect(response).toEqual(configs[10]);
    });

    service.findMatchingFile(configs, '3.1.1').subscribe((response) => {
      expect(response).toEqual(configs[9]);
    });
  });

  it('should match greater than', () => {
    const configs: Config[] = [
      { compatibleWithAppVersion: '>1.0.0' },
      { compatibleWithAppVersion: '>1.1.0' },
      { compatibleWithAppVersion: '>1.1.1' },
      { compatibleWithAppVersion: '>2.0.0' },
    ];

    service.findMatchingFile(configs, '1.1.0').subscribe(
      (response) => {
        expect(response).toEqual(configs[0]);
      },
      (err) => {
        console.log(err);
      },
    );
  });

  it('should match lower than', () => {
    const configs: Config[] = [
      { compatibleWithAppVersion: '<1.0.0' },
      { compatibleWithAppVersion: '<1.1.0' },
      { compatibleWithAppVersion: '<1.1.1' },
      { compatibleWithAppVersion: '<2.0.0' },
      { compatibleWithAppVersion: '<3.0.0' },
    ];

    service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
      expect(response).toEqual(configs[4]);
    });
  });

  it('should match lower than + equal', () => {
    const configs: Config[] = [
      { compatibleWithAppVersion: '<=1.0.0' },
      { compatibleWithAppVersion: '<=1.1.0' },
      { compatibleWithAppVersion: '<=1.1.1' },
      { compatibleWithAppVersion: '<=2.0.0' },
      { compatibleWithAppVersion: '<=3.0.0' },
    ];

    service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
      expect(response).toEqual(configs[4]);
    });
  });

  it('should match ~', () => {
    const configs: Config[] = [
      { compatibleWithAppVersion: '~1.0.0' },
      { compatibleWithAppVersion: '~2.0.0' },
    ];

    service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
      expect(response).toEqual(configs[0]);
    });

    service.findMatchingFile(configs, '2.0.0').subscribe((response) => {
      expect(response).toEqual(configs[1]);
    });
  });
});
