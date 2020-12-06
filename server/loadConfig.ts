const remoteGitTags = require('remote-git-tags');

import { get } from 'https';
import { satisfies } from 'semver';

import { Config } from './_interfaces/config.interface';
import { requestParams } from './_interfaces/requestParams.interface';
import { Tags } from './_interfaces/tag.interface';

const options = {
  headers: {
   'User-Agent': 'markusfalk',
   'Content-Type': 'application/json',
  //  'Authorization': token OAUTH-TOKEN
 }
};

export default class Configurator {

  constructor() {}

  private configs = [];

  private async getRemoteTags(): Promise<Map<string, string>> {
    return await remoteGitTags('https://github.com/markusfalk/cd-config-server-test-config');
  }

  private async getTreeFromHash(hash: string) {

    return await new Promise((resolve, reject) => {
      const url = `https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/trees/${hash}`;
      let response: string;
      return get(url, options, (res) => {
        res.on('data', (chunk: Buffer) => {
          response = chunk.toString('utf-8');
          console.log('chunk:');
          console.log(response);
          console.log('#######');
        }).on('end', () => {
          resolve((response));
        });
      }).on('error', (e: any) => {
        console.error('ERROR: ', e);
        reject(e);
      });
    });
  }

  private getConfigsFromTree(trees: any[]): any {
    return trees.filter((tree) => {
      return tree.path.contains('development.json')
    });
  }

  private async getBlobContent(tree: any): Promise<any> {
    return await get(`
      https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/blobs/${tree}
    `);
  }

  private async getContentFromBlob(blob: Blob): Promise<any> {
    return await get(`
      https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/blobs/${blob}
    `);
  }

  private async getConfigs(tags: Map<string, string>): Promise<any> {

    const configs: Config[] = [];
    const trees: any[] = [];
    const files: any[] = [];
    const blobs: any[] = [];

    await tags.forEach((key, value) => {
      this.getTreeFromHash(key).then((config) => {
        trees.push(config);
      })
      console.log('trees', trees);

    });

    await trees.forEach((key, value) => {
      this.getConfigsFromTree(key.tree).then((file: any) => {
        files.push(file);
      });
    });

    await files.forEach((key, value) => {
      this.getBlobContent(files).then((blob) => {
        blobs.push(blob);
      })
    });

    console.log('### tags', tags);
    console.log('### trees', trees);
    console.log('### files', files);
    console.log('### blobs', blobs);
    console.log('### configs', configs);

    return configs;
  }

  private async getGitTags(environment:string, appId: string): Promise<Map<string, string>> {
    return await this.getRemoteTags();
  }

  private matchSemanticVersionRange(tags: Config[], appVersion: string) {
    return tags.filter((tag) => {
      return satisfies(appVersion, tag.compatibleWithAppVersion);
    });
  }

  /*
   * GET DATA
   * fetch all tags
   * fetch tree from tags
   * fetch blobs from tags
   *
   * PROCESS DATA
   * match app version with 'compatibleWithAppVersion'
   * return matched json
   */
  public async findConfig(params: requestParams): Promise<Tags[]> {
    const matchedConfig: Config[] = [];
    const tags = await this.getGitTags(params.environment, params.appid);
    const configs = await this.getConfigs(tags);
    // matchedConfig = this.matchSemanticVersionRange(configs, params.appversion);
    return matchedConfig;
  }

}
