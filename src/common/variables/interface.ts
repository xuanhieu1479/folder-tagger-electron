import Folder from '../../be/entity/Folder';

interface folderQueryResult {
  data?: Folder | Array<Folder>;
  message: string;
  status: number;
}

export { folderQueryResult };
