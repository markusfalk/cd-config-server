import { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { HttpService } from '@nestjs/axios';

// const mockRemoteTags: Tag[] = [
//   {
//     ref: 'refs/tags/1.0.0',
//     node_id: 'MDM6UmVmMzE4ODg4MDQ1OnJlZnMvdGFncy8xLjAuMA==',
//     url:
//       'https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/refs/tags/1.0.0',
//     object: {
//       sha: 'f974d2e9812a968cc1accc3b95af1152febadb7d',
//       type: 'commit',
//       url:
//         'https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/commits/f974d2e9812a968cc1accc3b95af1152febadb7d',
//     },
//   },
//   {
//     ref: 'refs/tags/2.0.0',
//     node_id: 'MDM6UmVmMzE4ODg4MDQ1OnJlZnMvdGFncy8yLjAuMA==',
//     url:
//       'https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/refs/tags/2.0.0',
//     object: {
//       sha: 'bad9d3cf019c22ea2c593b2055b3bf1b5ba0cbe6',
//       type: 'commit',
//       url:
//         'https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/commits/bad9d3cf019c22ea2c593b2055b3bf1b5ba0cbe6',
//     },
//   },
//   {
//     ref: 'refs/tags/3.0.0',
//     node_id: 'MDM6UmVmMzE4ODg4MDQ1OnJlZnMvdGFncy8zLjAuMA==',
//     url:
//       'https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/refs/tags/3.0.0',
//     object: {
//       sha: '8be9e4db4e7618896d9dffb9ecc02c61747d7ce5',
//       type: 'commit',
//       url:
//         'https://api.github.com/repos/markusfalk/cd-config-server-test-config/git/commits/8be9e4db4e7618896d9dffb9ecc02c61747d7ce5',
//     },
//   },
// ];

const result: AxiosResponse = {
  data: {
    name: 'Jane Doe',
    grades: [3.7, 3.8, 3.9, 4.0, 3.6],
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
};

export const mockHttpService: Partial<HttpService> = {
  get: () => of(result),
};
