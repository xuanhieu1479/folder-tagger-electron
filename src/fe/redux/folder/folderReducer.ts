import { UPDATE_FOLDERS, SELECT_FOLDERS } from './folderActionType';
import { ReducerAction } from '../../../common/interfaces/feInterfaces';
import { Folder } from '../../../common/interfaces/folderInterfaces';

interface FolderReducerInterface {
  selectedFolders: Array<string>;
  foldersList: Array<Folder>;
  totalFolders: number;
}
const initState = {
  selectedFolders: [],
  foldersList: [],
  totalFolders: 0
};

const statusReducer = (
  state: FolderReducerInterface = initState,
  action: ReducerAction
): FolderReducerInterface => {
  const data = action.payload || {};
  const { foldersList, totalFolders, selectedFolders } = data;
  switch (action.type) {
    case UPDATE_FOLDERS:
      return { ...state, foldersList, totalFolders };
    case SELECT_FOLDERS:
      return { ...state, selectedFolders };
    default:
      return state;
  }
};

export default statusReducer;
