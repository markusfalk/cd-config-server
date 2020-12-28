import { CacheInterceptor, Controller, Get, Render, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor() {}

  @Get()
  @Render('index')
  @ApiOperation({ description: 'Project Homepage.' })
  getApiRoot() {
    return {
      title: 'Continuous Delivery Configuration Server',
    };
  }
}
