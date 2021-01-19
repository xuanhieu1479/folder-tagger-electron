import { Folder } from './folderInterfaces';

interface RootState {
  status: {
    isLoading: boolean;
  };
  folder: {
    selectedFolders: Array<string>;
    foldersList: Array<Folder>;
    totalFolders: number;
    categories: Array<string>;
    languages: Array<string>;
  };
  tag: {
    artist: Array<string>;
    group: Array<string>;
    parody: Array<string>;
    character: Array<string>;
    genre: Array<string>;
  };
}

interface ReducerAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export { RootState, ReducerAction };
