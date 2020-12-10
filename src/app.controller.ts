import {
  CacheInterceptor, CacheTTL, Controller, Get, Param, UseInterceptors
} from '@nestjs/common';

import { AppService } from './app.service';
import { AppConfigService } from './appconfig/appconfig.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly appConfigService: AppConfigService,
  ) {}

  @Get()
  getApiRoot(): string {
    return this.appService.getApiRoot();
  }

  @Get('/:appid/:appversion/:environment')
  @CacheTTL(5 * 60)
  getConfig(
    @Param('appid') appid: string,
    @Param('appversion') appversion: string,
    @Param('environment') environment: string,
  ) {
    return this.appConfigService.getApi(appid, appversion, environment);
  }
}
