import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';
import { Tree } from 'src/_interfaces/tree.interface';

import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { mockFileContentRequest } from '../../test/_mock-responses/FileContentsRequest.mock';
import { mockTagsResponse } from '../../test/_mock-responses/TagsRequest.mock';
import { mockTreesRequest } from '../../test/_mock-responses/TreesRequest.mock';
import { mockTreeDevelopment, mockTreeStaging } from '../../test/_mock-services/mockTree';
import { TagCollection } from '../_interfaces/tag-collection.interface';
import { ConfigurationService } from '../_services/configuration/configuration.service';
import { GithubService } from './github.service';

export interface RateLimit {
  rate: number;
}

describe('GithubService', () => {
  let service: GithubService;
  const mockTrees = [[mockTreeDevelopment], [mockTreeStaging]];

  const result: Observable<AxiosResponse<RateLimit>> = of({
    data: {
      rate: 123,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  });

  const get = function <RateLimit>(url: string, config?: AxiosRequestConfig) {
    return result;
  };

  let http: any = {
    get: jest.fn().mockImplementation(get),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        // {
        //   provide: HttpService,
        //   useValue: http,
        // },
        GithubService,
        ConfigurationService,
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    http = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getRemoteTags', () => {
    expect(service.getRemoteTags).toBeDefined();

    mockTagsResponse(http);

    const appid = 'foo';
    const expected = [{ '1.0.0': 'abc' }, { '2.0.0': 'def' }];

    service.getRemoteTags(appid).subscribe((tagmap) => {
      expect(tagmap).toEqual(expected);
    });

    expect(http.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/refs/tags`,
      expect.anything(),
    );

  });

  it('should getTrees', () => {
    expect(service.getTrees).toBeDefined();

    mockTreesRequest(http);
    mockTreesRequest(http);

    const appid = 'foo';
    const collection: TagCollection[] = [
      { '1.0.0': 'abc' },
      { '2.0.0': 'def' },
    ];

    service.getTrees(collection, appid).subscribe((expected) => {
      expect(expected).toBeDefined();
    });

    expect(http.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/trees/abc`,
      expect.anything(),
    );

    expect(http.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/trees/def`,
      expect.anything(),
    );
  });

  it('should getFileContents', () => {
    expect(service.getFileContents).toBeDefined();

    const appid = 'foo';
    const trees: Tree[][] = [[mockTreeDevelopment], [mockTreeStaging]];

    mockFileContentRequest(http);
    mockFileContentRequest(http);

    service.getFileContents(trees, appid).subscribe((expected) => {
      expect(expected).toBeDefined();
    });

    expect(http.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/blobs/development`,
      expect.anything(),
    );

    expect(http.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/${process.env['GITHUBUSERNAME']}/${appid}-config/git/blobs/staging`,
      expect.anything(),
    );
  });

  it('should filter by environment', () => {
    expect(service.findFileTreesFilteredByEnvironment).toBeDefined();

    const trees: Tree[][] = [[mockTreeDevelopment], [mockTreeStaging]];
    const devTree: Tree[][] = [
      [
        {
          mode: '',
          path: 'development.json',
          sha: 'development',
          size: 1,
          type: '',
          url: '',
        },
      ],
    ];
    const stageTree: Tree[][] = [
      [
        {
          mode: '',
          path: 'staging.json',
          sha: 'staging',
          size: 1,
          type: '',
          url: '',
        },
      ],
    ];

    service
      .findFileTreesFilteredByEnvironment(trees, 'development')
      .subscribe((expected) => {
        expect(expected).toEqual(devTree);
      });

    service
      .findFileTreesFilteredByEnvironment(trees, 'staging')
      .subscribe((expected) => {
        expect(expected).toEqual(stageTree);
      });

  });
});
