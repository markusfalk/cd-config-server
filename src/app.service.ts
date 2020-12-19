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
            <link href="https://fonts.googleapis.com/css?family=Comfortaa&amp;display=swap" rel="stylesheet">
            <style>

                html {
                  background-color: #eee;
                }
                a,
                html {
                  font-family: 'Comfortaa', Verdana, Geneva, Tahoma, sans-serif;
                  color: #333;
                }
                a:link,
                a:visited {
                  color: #c86dd7;
                }
                main {
                  padding: 5rem;
                  box-sizing: border-box;
                  max-width: 80%;
                  margin: 50px auto;
                  background-color: #fff;
                  border-radius: 5rem;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  margin: 0 auto;
                  display: block;
                  filter: drop-shadow(0 0 15px #ccc);
                }
                h1, h2, h3 {
                  color: #3023ae;
                }
                h1 {
                  text-align: center;
                  margin: 3rem 0;
                  line-height: 1.4;
                }
                h2 {
                  margin-top: 3rem;
                }
                h3 {
                  margin-top: 2rem;
                }
                code {
                  font-family: monospace;
                  background-color: #333;
                  display: block;
                  color:  #fff;
                  padding: 1rem;
                }
                li {
                  line-height: 2;
                }
            </style>
        </head>
        <body>
            <main>

                <img width="200" height="200" src="https://raw.githubusercontent.com/markusfalk/markus-falk.com/master/img/cd-config-server-logo.svg?token=AAKKHMFXCGE4ZRRNH2P5S4S74ZOFY" alt="" />

                <h1>Continuous Delivery Configuration Server</h1>

                <img src="https://raw.githubusercontent.com/markusfalk/cd-config-server/main/src/assets/img/cd-config-server-flow.svg?token=AAKKHMGINFWVFQ7FX67NLYC744S3S" alt="" width="1024" height="512" />

                <h2>Documentation</h2>
                <ul>
                  <li><a href="/api">Open Api</a></li>
                  <li><a href="https://hub.docker.com/r/markusfalk/cd-config-server">Documentation</a></li>
                </ul>

                <h2>Usage Examples</h2>

                <p>The following examples use a demo <a href="https://github.com/markusfalk/cd-config-server-test-config" title="go to github">configuration repository</a>.</p>

                <h3>Different Versions</h3>
                <ul>
                  <li><a href="/cd-config-server-test/1.0.0/development">/cd-config-server-test/1.0.0/development</a></li>
                  <li><a href="/cd-config-server-test/2.0.0/development">/cd-config-server-test/2.0.0/development</a></li>
                </ul>

                <h3>Different environment</h3>
                <ul>
                  <li><a href="/cd-config-server-test/1.0.0/development">/cd-config-server-test/1.0.0/development</a></li>
                  <li><a href="/cd-config-server-test/1.0.0/test">/cd-config-server-test/1.0.0/test</a></li>
                  <li><a href="/cd-config-server-test/1.0.0/staging">/cd-config-server-test/1.0.0/staging</a></li>
                  <li><a href="/cd-config-server-test/1.0.0/production">/cd-config-server-test/1.0.0/production</a></li>
                </ul>

            </main>
        </body>
    </html>
    `;
  }
}
