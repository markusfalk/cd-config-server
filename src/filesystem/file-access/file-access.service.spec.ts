import fs = require('fs');
import path = require('path');

import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { Config } from '../../_interfaces/config.interface';
import { FileAccessService } from './file-access.service';
import { ErrorService } from '../../error/error/error.service';

describe('FileAccessService', () => {
  let service: FileAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorService, FileAccessService],
    }).compile();

    service = module.get<FileAccessService>(FileAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('read directory', () => {
    it('should read directories', () => {
      const mockFsResponse = ['.DS_Store', '1.0.0', '2.0.0'];
      const mockServiceResponse = ['1.0.0', '2.0.0'];
      const mockPath = path.join(__dirname, '../../configfiles');
      const mockFolder = 'testFolder';
      const resultingPath = `${mockPath}/${mockFolder}`;

      jest
        .spyOn<any, string>(fs, 'readdirSync')
        .mockImplementationOnce(() => mockFsResponse);

      service.readDirectory(mockFolder).subscribe((response) => {
        expect(response).toEqual(mockServiceResponse);
      });

      expect(fs.readdirSync).toHaveBeenCalledWith(resultingPath);
    });

    it('should throw error on empty directory', () => {
      const err = new Error('TEST: Error empty dir');
      const mockPath = 'testFolder';

      jest.spyOn<any, string>(fs, 'readdirSync').mockImplementationOnce(() => {
        throw err;
      });

      service
        .readDirectory(mockPath)
        .pipe(
          catchError((response) => {
            expect(response).toBeInstanceOf(HttpException);
            return of(response);
          }),
        )
        .subscribe();
    });
  });

  describe('read files', () => {
    it('should read staging file', () => {
      const filepath = path.join(__dirname, '../../configfiles');
      const filename = 'development.json';
      const resultingPath = `${filepath}/testfolder/${filename}`;
      const mockResponse = '{ "test": true }';

      jest
        .spyOn<any, string>(fs, 'readFileSync')
        .mockImplementationOnce(() => mockResponse);

      service.readFile<Config>('testfolder', filename).subscribe((response) => {
        expect(response).toEqual({ test: true });
      });
      expect(fs.readFileSync).toHaveBeenCalledWith(
        resultingPath,
        expect.anything(),
      );
    });
  });
});
