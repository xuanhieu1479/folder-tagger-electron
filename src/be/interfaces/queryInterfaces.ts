import { Folder } from '../entity/entity';

interface folderQueryResult {
  data?: Folder | Array<Folder>;
  message: string;
  status: number;
}

export { folderQueryResult };
