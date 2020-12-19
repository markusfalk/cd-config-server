import { catchError } from 'rxjs/operators';

import {
  CacheInterceptor, CacheTTL, Controller, Get, HttpException, HttpStatus, Param, UseInterceptors
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

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
  @ApiOperation({ description: 'Project Homepage.' })
  getApiRoot(): string {
    return this.appService.getApiRoot();
  }

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
    return this.appConfigService.getApi(appid, appversion, environment).pipe(
      catchError((err) => {
        console.error('Error:', err);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: err,
          },
          HttpStatus.NOT_FOUND,
        );
      }),
    );
  }
}
