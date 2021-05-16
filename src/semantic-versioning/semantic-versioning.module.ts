import { Module } from '@nestjs/common';
import { ErrorModule } from '../error/error.module';
import { SemanticVersioningService } from './semantic-versioning/semantic-versioning.service';

@Module({
  imports: [ErrorModule],
  providers: [SemanticVersioningService],
  exports: [SemanticVersioningService],
})
export class SemanticVersioningModule {}
