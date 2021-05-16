import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { forkJoin } from 'rxjs';

import { Config } from '../../_interfaces/config.interface';
import { ErrorService } from '../error/error.service';
import { errorMessages } from './errorMessages.enum';
import { SemanticVersioningService } from './semantic-versioning.service';

describe('SemanticVersioningService', () => {
  let service: SemanticVersioningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SemanticVersioningService, ErrorService],
    }).compile();

    service = module.get<SemanticVersioningService>(SemanticVersioningService);
  });

  describe('find matching file', () => {
    it('should match specific version', (done) => {
      const configs: Config[] = [
        { compatibleWithAppVersion: '1.0.0' },
        { compatibleWithAppVersion: '2.0.0' },
        { compatibleWithAppVersion: '3.0.0' },
      ];

      forkJoin([
        service.findMatchingFile(configs, '1.0.0'),
        service.findMatchingFile(configs, '2.0.0'),
        service.findMatchingFile(configs, '3.0.0'),
      ]).subscribe(([one, two, three]) => {
        expect(one).toEqual(configs[0]);
        expect(two).toEqual(configs[1]);
        expect(three).toEqual(configs[2]);
        done();
      });
    });

    it('should return error on wrong config key', (done) => {
      const configs: any[] = [
        { compatibleWithAppVersion: '1.0.0' },
        { wrongKey: '2.0.0' },
      ];

      service.findMatchingFile(configs, '1.0.0').subscribe(
        (response) => {
          expect(response).toEqual(configs[0]);
          done();
        },
        (error: HttpException) => {
          expect(error.getStatus()).toEqual(404);
          expect(error.getResponse()).toEqual('');
          done();
        },
      );
    });

    it('should return error when appversion is not semver', (done) => {
      const configs: any[] = [{ compatibleWithAppVersion: '1.0.0' }];

      service.findMatchingFile(configs, 'abc').subscribe(
        () => console.log(),
        (error: HttpException) => {
          expect(error.getStatus()).toEqual(400);
          expect(error.getResponse()).toEqual(
            `abc: ${errorMessages.nonSemver}`,
          );
          done();
        },
      );
    });

    it('should throw error on empty results', (done) => {
      const configs: Config[] = [{ compatibleWithAppVersion: '1.0.0' }];

      service.findMatchingFile(configs, '2.0.0').subscribe(
        () => console.log(),
        (error: HttpException) => {
          expect(error.getStatus()).toEqual(404);
          expect(error.getResponse()).toEqual(
            `${errorMessages.noConfig} 2.0.0`,
          );
          done();
        },
      );
    });

    it('should match ^', (done) => {
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

      forkJoin([
        service.findMatchingFile(configs, '1.0.0'),
        service.findMatchingFile(configs, '1.1.0'),
        service.findMatchingFile(configs, '2.0.0'),
        service.findMatchingFile(configs, '2.0.1'),
        service.findMatchingFile(configs, '3.0.0'),
        service.findMatchingFile(configs, '3.0.1'),
        service.findMatchingFile(configs, '3.1.1'),
      ]).subscribe(([one, two, three, four, five, six, seven]) => {
        expect(one).toEqual(configs[6]);
        expect(two).toEqual(configs[4]);
        expect(three).toEqual(configs[0]);
        expect(four).toEqual(configs[0]);
        expect(five).toEqual(configs[10]);
        expect(six).toEqual(configs[10]);
        expect(seven).toEqual(configs[9]);
        done();
      });
    });

    it('should match greater than', (done) => {
      const configs: Config[] = [
        { compatibleWithAppVersion: '>1.0.0' },
        { compatibleWithAppVersion: '>1.1.0' },
        { compatibleWithAppVersion: '>1.1.1' },
        { compatibleWithAppVersion: '>2.0.0' },
      ];

      service.findMatchingFile(configs, '1.1.0').subscribe(
        (response) => {
          expect(response).toEqual(configs[0]);
          done();
        },
        (err) => {
          console.log(err);
        },
      );
    });

    it('should match lower than', (done) => {
      const configs: Config[] = [
        { compatibleWithAppVersion: '<1.0.0' },
        { compatibleWithAppVersion: '<1.1.0' },
        { compatibleWithAppVersion: '<1.1.1' },
        { compatibleWithAppVersion: '<2.0.0' },
        { compatibleWithAppVersion: '<3.0.0' },
      ];

      service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
        expect(response).toEqual(configs[4]);
        done();
      });
    });

    it('should match lower than + equal', (done) => {
      const configs: Config[] = [
        { compatibleWithAppVersion: '<=1.0.0' },
        { compatibleWithAppVersion: '<=1.1.0' },
        { compatibleWithAppVersion: '<=1.1.1' },
        { compatibleWithAppVersion: '<=2.0.0' },
        { compatibleWithAppVersion: '<=3.0.0' },
      ];

      service.findMatchingFile(configs, '1.0.0').subscribe((response) => {
        expect(response).toEqual(configs[4]);
        done();
      });
    });

    it('should match ~', (done) => {
      const configs: Config[] = [
        { compatibleWithAppVersion: '~1.0.0' },
        { compatibleWithAppVersion: '~2.0.0' },
      ];

      forkJoin([
        service.findMatchingFile(configs, '1.0.0'),
        service.findMatchingFile(configs, '2.0.0'),
      ]).subscribe(([one, two]) => {
        expect(one).toEqual(configs[0]);
        expect(two).toEqual(configs[1]);
        done();
      });
    });
  });

  describe('semver helper', () => {
    it('should parse semver correctly', () => {
      const test = service.parseSemanticVersion('1.0.0');
      expect(test).toBeTruthy();
    });
    it('should err with none-semver', () => {
      const semver = service.parseSemanticVersion('abc');
      expect(semver).toBeFalsy();
    });
  });
});
