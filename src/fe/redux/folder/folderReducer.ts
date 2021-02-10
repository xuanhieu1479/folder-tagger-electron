import {
  GET_FOLDERS,
  SELECT_FOLDERS,
  GET_CATEGORIES,
  GET_LANGUAGES
} from './folderActionType';
import {
  ReducerAction,
  FolderReducerInterface
} from '../../../common/interfaces/feInterfaces';

export const folderInitState: FolderReducerInterface = {
  selectedFolders: [],
  foldersList: [],
  totalFolders: 0,
  categories: [],
  languages: []
};

const statusReducer = (
  state: FolderReducerInterface = folderInitState,
  action: ReducerAction
): FolderReducerInterface => {
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
