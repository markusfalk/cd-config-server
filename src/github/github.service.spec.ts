import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { mockTreeDevelopment, mockTreeStaging } from '../../test/_mock-services/mockTree';
import { Tree } from '../_interfaces/tree.interface';
import { ConfigurationService } from '../_services/configuration/configuration.service';
import { GithubService } from './github.service';

describe('GithubService', () => {
  let service: GithubService;
  const mockTrees = [[mockTreeDevelopment], [mockTreeStaging]];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [GithubService, ConfigurationService],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getRemoteTags', () => {
    expect(service.getRemoteTags).toBeDefined();
  });

  it('should getTrees', () => {
    expect(service.getTrees).toBeDefined();
    // const response = service.getTrees(mockTagCollection, 'foo');
    // response.subscribe((trees) => {
    //   expect(trees).toBe([]);
    // });
  });

  it('should getFileContents', () => {
    // jest.spyOn(service, 'loadFileContent').mockImplementationOnce(() => of({}));
    expect(service.getFileContents).toBeDefined();
    // service.getFileContents(mockTrees, 'mockapp').subscribe((data) => {
    //   expect(data).toEqual({});
    // });
  });

  it('should filter by environment', () => {
    service
      .findFileTreesFilteredByEnvironment(mockTrees, 'development')
      .subscribe((data) => {
        expect(data).toEqual<Tree[][]>([[mockTreeDevelopment]]);
      })
      .unsubscribe();

    service
      .findFileTreesFilteredByEnvironment(mockTrees, 'staging')
      .subscribe((data) => {
        expect(data).toEqual<Tree[][]>([[mockTreeStaging]]);
      })
      .unsubscribe();
  });
});
