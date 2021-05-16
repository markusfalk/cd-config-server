import { Module } from '@nestjs/common';
import { SemanticVersioningModule } from '../semantic-versioning/semantic-versioning.module';
import { ErrorModule } from '../error/error.module';
import { FileAccessService } from './file-access/file-access.service';
import { FileSystemService } from './file-system/file-system.service';

@Module({
  imports: [ErrorModule, SemanticVersioningModule],
  providers: [FileAccessService, FileSystemService],
  exports: [FileSystemService],
})
export class FilesystemModule {}
