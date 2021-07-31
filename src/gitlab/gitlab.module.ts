import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration/configuration.module';
import { ErrorModule } from '../error/error.module';
import { GitlabService } from './gitlab/gitlab.service';

@Module({
  imports: [ErrorModule, HttpModule, ConfigurationModule],
  providers: [GitlabService],
  exports: [GitlabService],
})
export class GitlabModule {}
