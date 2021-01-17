import { UPDATE_FOLDERS } from './folderActionType';
import { ReducerAction } from '../../../common/interfaces/feInterfaces';
import { Folder } from '../../../common/interfaces/folderInterfaces';

interface FolderReducerInterface {
  foldersList: Array<Folder>;
  totalFolders: number;
}
const initState = {
  foldersList: [],
  totalFolders: 0
};

const statusReducer = (
  state: FolderReducerInterface = initState,
  action: ReducerAction
): FolderReducerInterface => {
  const data = action.payload || {};
  const { foldersList, totalFolders } = data;
  switch (action.type) {
    case UPDATE_FOLDERS:
      return { ...state, foldersList, totalFolders };
    default:
      return state;
  }
};

export default statusReducer;
