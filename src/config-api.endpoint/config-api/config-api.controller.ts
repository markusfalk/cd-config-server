import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';

import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

import { AppConfigService } from '../_services/appconfig/appconfig.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class ConfigApiController {
  constructor(private readonly appConfigService: AppConfigService) {}
  @Get('/:appid/:appversion/:environment')
  @CacheTTL(parseFloat(process.env['CACHE_TTL']) || 300)
  @ApiOperation({ description: 'Load the config file from your repo.' })
  @ApiParam({
    name: 'appid',
    description: 'An identifier of your app.',
  })
  @ApiParam({
    name: 'appversion',
    description: 'The semantic version matching of your app.',
  })
  @ApiParam({
    name: 'environment',
    description: 'An identifier of the current environment.',
  })
  getConfig(
    @Param('appid') appid: string,
    @Param('appversion') appversion: string,
    @Param('environment') environment: string,
  ) {
    return this.appConfigService.getConfig(appid, appversion, environment).pipe(
      catchError((err: AxiosError) => {
        throw new HttpException(err.response.statusText, err.response.status);
      }),
    );
  }
}
