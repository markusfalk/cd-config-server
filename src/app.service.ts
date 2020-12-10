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
                  font-family: 'Comfortaa', Verdana, Geneva, Tahoma, sans-serif;
                  color: #333;
                }
                main {
                  padding: 5rem;
                  box-sizing: border-box;
                  max-width: 80%;
                  margin: 50px auto;
                  background-color: #eee;
                  border-radius: 5rem;
                }
                img {
                  margin: 0 auto;
                  display: block;
                }
                h1 {
                  text-align: center;
                  margin: 3rem 0;
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

                <img width="200" height="200" src="https://github.com/markusfalk/git-workflow/raw/master/git-workflow-logo.svg" alt="" />

                <h1>Continuous Delivery Configuration Server for Github</h1>

                <h2>Open Api</h2>
                <p><a href="/api">Api Documentation</a></p>

                <h2>Usage Examples</h2>

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

                <h2>Proof of Concept Config Files</h2>

                <h3>Matching Entry</h3>
                <p>Param appversion is matched against this configured range in the config file.</p>
                <code>
                  {<br>
                  &nbsp;&nbsp;"compatibleWithAppVersion": "2.0.0",<br>
                  &nbsp;&nbsp;...<br>
                  }
                </code>

                <h3>Github Repository</h3>
                <p>Repository name: &lt;:appid&gt;-config</p>
                <ul>
                  <li><a href="https://github.com/markusfalk/cd-config-server-test-config">https://github.com/markusfalk/cd-config-server-test-config</a></li>
                </ul>

            </main>
        </body>
    </html>
    `;
  }
}
