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
            <style>
                main {
                  padding: 30px;
                  max-width: 80%;
                  margin: 0 auto;
                }
                img {
                  margin: 0 auto;
                  display: block;
                }
                * {
                  color: #333;
                  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                }
                h1 {
                  text-align: center;
                }
                code {
                  font-weight: bolder;
                }
            </style>
        </head>
        <body>
            <main>

                <h1>Continuous Delivery Configuration Server for Github</h1>
                <img width="150" height="150" src="https://github.com/markusfalk/git-workflow/raw/master/git-workflow-logo.svg" alt="" />
                <p>This API loads a config file from Github</p>

                <h2>API</h2>
                <p>GET <code>/:appid/:appversion/:environment</code></p>
                <ul>
                    <li><code>appid</code>: your app identifier (will be extended with "-config" to look for the config repository.</li>
                    <li><code>appversion</code>: the current version of your app (will be matched against the config file key "compatibleWithAppVersion")</li>
                    <li><code>environment</code>: the CD stage the app is running in (will match the config json file in the config repository)</li>
                </ul>
                <h2>Usage Examples</h2>

                <h3>Different Versions</h3>
                <p><a href="/cd-config-server-test/1.0.0/development">/cd-config-server-test/1.0.0/development</a></p>
                <p><a href="/cd-config-server-test/2.0.0/development">/cd-config-server-test/2.0.0/development</a></p>

                <h3>Different environment</h3>
                <p><a href="/cd-config-server-test/1.0.0/development">/cd-config-server-test/1.0.0/development</a></p>
                <p><a href="/cd-config-server-test/1.0.0/test">/cd-config-server-test/1.0.0/test</a></p>
                <p><a href="/cd-config-server-test/1.0.0/staging">/cd-config-server-test/1.0.0/staging</a></p>
                <p><a href="/cd-config-server-test/1.0.0/production">/cd-config-server-test/1.0.0/production</a></p>

                <h2>Proof of Concept Config Files</h2>
                <p><a href="https://github.com/markusfalk/cd-config-server-test-config">https://github.com/markusfalk/cd-config-server-test-config</a></p>

            </main>
        </body>
    </html>
    `;
  }
}
