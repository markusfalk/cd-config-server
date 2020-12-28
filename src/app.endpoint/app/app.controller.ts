import { CacheInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AppService } from '../../_services/app/app.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ description: 'Project Homepage.' })
  getApiRoot(): string {
    return this.appService.getApiRoot();
  }

  @Get('/foo')
  @ApiOperation({ description: 'Project Homepage.' })
  getFoo(): string {
    return 'foo';
  }
}
