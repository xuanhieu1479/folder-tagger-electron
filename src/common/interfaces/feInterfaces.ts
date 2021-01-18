import { Folder } from './folderInterfaces';

interface RootState {
  status: {
    isLoading: boolean;
  };
  folder: {
    selectedFolders: Array<string>;
    foldersList: Array<Folder>;
    totalFolders: number;
  };
}

interface ReducerAction {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export { RootState, ReducerAction };