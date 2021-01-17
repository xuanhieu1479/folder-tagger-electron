import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootState } from '../../common/interfaces/feInterfaces';
import rootReducer from './rootReducer';

const initState: RootState = {
  status: {
    isLoading: false
  },
  folder: {
    foldersList: [],
    totalFolders: 0
  }
};

export default createStore(rootReducer, initState, composeWithDevTools());
