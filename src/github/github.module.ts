import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration/configuration.module';
import { ErrorModule } from '../error/error.module';
import { GithubService } from './github/github.service';

@Module({
  imports: [ErrorModule, ConfigurationModule, HttpModule],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
