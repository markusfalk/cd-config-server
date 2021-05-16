import { Observable, of } from 'rxjs';

import { HttpStatus, Injectable } from '@nestjs/common';

import fs = require('fs');
import path = require('path');
import { ErrorService } from '../../../error/error/error.service';
import { errorMessages } from './errorMessages.enum';

@Injectable()
export class FileAccessService {
  constructor(private errorService: ErrorService) {}

  nestFilePath = path.join(__dirname, '../../configfiles');
  excludedDirectories = ['.DS_Store', '.git'];

  private removeExcludedDirectories(directories: string[]): string[] {
    return directories.filter((directory) => {
      return !this.excludedDirectories.includes(directory);
    });
  }

  private parseFile<FileType>(fileContents: string): Observable<FileType> {
    if (fileContents.length) {
      return of(JSON.parse(fileContents));
    } else {
      return this.errorService.handleHttpError({
        errorMessage: errorMessages.emptyFile,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }
  }

  readFile<FileType>(filePath: string, fileName: string): Observable<FileType> {
    filePath = `${this.nestFilePath}/${filePath}`;
    try {
      const fileContent = fs.readFileSync(`${filePath}/${fileName}`, {
        encoding: 'utf-8',
      });
      return this.parseFile<FileType>(fileContent);
    } catch (error) {
      return this.errorService.handleHttpError({
        errorLog: error,
        errorMessage: `${fileName} ${errorMessages.environmentNotFound}`,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }
  }

  readDirectory(directoryPath: string): Observable<string[]> {
    directoryPath = `${this.nestFilePath}/${directoryPath}`;
    try {
      const directory = fs.readdirSync(directoryPath);
      const filtered = this.removeExcludedDirectories(directory);
      return of(filtered);
    } catch (error) {
      return this.errorService.handleHttpError({
        errorLog: error,
        errorMessage: errorMessages.noConfig,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }
  }
}
