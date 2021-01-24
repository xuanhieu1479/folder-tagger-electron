import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootState } from '../../common/interfaces/feInterfaces';
import rootReducer from './rootReducer';
import { folderInitState } from './folder/folderReducer';
import { settingInitState } from './setting/settingReducer';
import { statusInitState } from './status/statusReducer';
import { tagInitState } from './tag/tagReducer';

const initState: RootState = {
  status: { ...statusInitState },
  folder: { ...folderInitState },
  tag: { ...tagInitState },
  setting: { ...settingInitState }
};

const integrateReduxDevTools = () => {
  if (process.env.NODE_ENV === 'development') return composeWithDevTools();
  else return undefined;
};

export default createStore(rootReducer, initState, integrateReduxDevTools());
