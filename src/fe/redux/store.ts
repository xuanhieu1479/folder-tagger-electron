import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootState } from '../../common/interfaces/feInterfaces';
import rootReducer from './rootReducer';

const initState: rootState = {
  status: {
    isLoading: false
  }
};

export default createStore(rootReducer, initState, composeWithDevTools());
