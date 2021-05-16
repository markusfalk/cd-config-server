import { Tree } from './tree.interface';

export interface Trees {
  sha: string;
  url: string;
  tree: Tree[];
  truncated: boolean;
}
