import {
  ReducerAction,
  SettingReducer
} from '../../../common/interfaces/feInterfaces';
import { SETTING } from '../../../common/variables/commonVariables';
import { UPDATE_SETTINGS } from './settingActionType';

export const settingInitState: SettingReducer = SETTING.DEFAULT;

const statusReducer = (
  state: SettingReducer = settingInitState,
  action: ReducerAction
): SettingReducer => {
  const data = action.payload || {};
  switch (action.type) {
    case UPDATE_SETTINGS:
      return { ...state, ...data };
    default:
      return state;
  }
};

export default statusReducer;
