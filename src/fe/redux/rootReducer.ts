import { combineReducers } from 'redux';
import statusReducer from './status/statusReducer';
import folderReducer from './folder/folderReducer';
import tagReducer from './tag/tagReducer';
import settingReducer from './setting/settingReducer';

export default combineReducers({
  status: statusReducer,
  folder: folderReducer,
  tag: tagReducer,
  setting: settingReducer
});
