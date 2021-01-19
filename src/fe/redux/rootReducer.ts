import { combineReducers } from 'redux';
import statusReducer from './status/statusReducer';
import folderReducer from './folder/folderReducer';
import tagReducer from './tag/tagReducer';

export default combineReducers({
  status: statusReducer,
  folder: folderReducer,
  tag: tagReducer
});
