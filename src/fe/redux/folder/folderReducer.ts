import {
  GET_FOLDERS,
  SELECT_FOLDERS,
  GET_CATEGORIES,
  GET_LANGUAGES
} from './folderActionType';
import {
  ReducerAction,
  FolderReducer
} from '../../../common/interfaces/feInterfaces';

export const folderInitState: FolderReducer = {
  selectedFolders: [],
  foldersList: [],
  totalFolders: 0,
  categories: [],
  languages: []
};

const statusReducer = (
  state: FolderReducer = folderInitState,
  action: ReducerAction
): FolderReducer => {
  const data = action.payload || {};
  const {
    foldersList,
    totalFolders,
    selectedFolders,
    categories,
    languages
  } = data;
  switch (action.type) {
    case GET_FOLDERS:
      return { ...state, foldersList, totalFolders };
    case SELECT_FOLDERS:
      return { ...state, selectedFolders };
    case GET_CATEGORIES:
      return { ...state, categories };
    case GET_LANGUAGES:
      return { ...state, languages };
    default:
      return state;
  }
};

export default statusReducer;
