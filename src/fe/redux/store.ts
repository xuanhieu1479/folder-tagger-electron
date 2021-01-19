import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootState } from '../../common/interfaces/feInterfaces';
import rootReducer from './rootReducer';

const initState: RootState = {
  status: {
    isLoading: false
  },
  folder: {
    selectedFolders: [],
    foldersList: [],
    totalFolders: 0,
    categories: [],
    languages: []
  },
  tag: {
    artist: [],
    group: [],
    parody: [],
    character: [],
    genre: []
  }
};

const integrateReduxDevTools = () => {
  if (process.env.NODE_ENV === 'development') return composeWithDevTools();
  else return undefined;
};

export default createStore(rootReducer, initState, integrateReduxDevTools());
