import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiRoot(): string {
    return `
      <p>
        Config Server works
      </p>
    `;
  }
}
