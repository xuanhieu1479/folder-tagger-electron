import { combineReducers } from 'redux';
import statusReducer from './status/statusReducer';
import folderReducer from './folder/folderReducer';

export default combineReducers({
  status: statusReducer,
  folder: folderReducer
});
