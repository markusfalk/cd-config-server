import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getApiRoot(): string {
    return this.appService.getApiRoot();
  }

  @Get('/:appid/:appversion/:environment')
  getConfig(
    @Param('appid') appid: string,
    @Param('appversion') appversion: string,
    @Param('environment') environment: string,
  ) {
    return this.configService.getApi(appid, appversion, environment);
  }
}
