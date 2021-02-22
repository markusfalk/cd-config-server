import { Observable, of, throwError } from 'rxjs';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { createErrorOptions } from '../../_interfaces/createErrorOptions.interface';

import fs = require('fs');
import path = require('path');
@Injectable()
export class FileAccessService {
  nestFilePath = path.join(__dirname, '../../configfiles');
  excludedDirectories = ['.DS_Store'];

  private removeExcludedDirectories(directories: string[]): string[] {
    return directories.filter((directory) => {
      return !this.excludedDirectories.includes(directory);
    });
  }

  private createError(options: createErrorOptions) {
    const err = new HttpException(
      {
        status: options.httpStatus,
        error: options.errorMessage,
      },
      options.httpStatus,
    );
    if (options.errorLog) {
      console.error(options.errorLog);
    }
    return throwError(err);
  }

  private parseFile<FileType>(fileContents: string): Observable<FileType> {
    if (fileContents.length) {
      return of(JSON.parse(fileContents));
    } else {
      return this.createError({
        errorLog: 'ERROR: File is empty.',
        errorMessage: 'File is empty.',
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
      return this.createError({
        errorLog: error,
        errorMessage: 'File unreadable.',
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
      return this.createError({
        errorLog: error,
        errorMessage: `No configuration versions found.`,
        httpStatus: HttpStatus.NOT_FOUND,
      });
    }
  }
}
