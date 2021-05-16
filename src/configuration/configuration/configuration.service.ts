import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  private env = process.env;

  getEnvironmentConfig(key: string) {
    return this.env[key];
  }
}
