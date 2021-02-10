import {
  ReducerAction,
  SettingReducerInterface
} from '../../../common/interfaces/feInterfaces';
import { SETTING } from '../../../common/variables/commonVariables';
import { UPDATE_SETTINGS } from './settingActionType';

export const settingInitState: SettingReducerInterface = SETTING.DEFAULT;

const statusReducer = (
  state: SettingReducerInterface = settingInitState,
  action: ReducerAction
): SettingReducerInterface => {
  const data = action.payload || {};
  switch (action.type) {
    case UPDATE_SETTINGS:
      return { ...state, ...data };
    default:
      return state;
  }
};

export default statusReducer;
