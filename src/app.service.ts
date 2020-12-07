import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getApiRoot(): string {
    return `
    <!doctype html>
    <html lang="en">
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CD Config Server</title>
      </head>
      <body>
          <main>
              <h1>Continuous Delivery Configuration Server for Github</h1>
          </main>
      </body>
    </html>
    `;
  }
}
