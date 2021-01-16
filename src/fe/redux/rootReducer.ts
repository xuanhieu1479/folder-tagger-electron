import { combineReducers } from 'redux';
import statusReducer from './status/statusReducer';

export default combineReducers({
  status: statusReducer
});
