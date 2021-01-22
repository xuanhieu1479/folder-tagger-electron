import fs from 'fs';
import ini from 'ini';
import { Dispatch } from 'redux';
import { SettingReducerInterface } from '../../../common/interfaces/feInterfaces';
import { SETTING } from '../../../common/variables/commonVariables';
import { UPDATE_SETTINGS } from './settingActionType';
import { showMessage } from '../../../utility/showMessage';

const getSettings = (dispatch: Dispatch): void => {
  try {
    if (!fs.existsSync(SETTING.PATH)) {
      updateSettings(dispatch);
    } else {
      const data = ini.parse(fs.readFileSync(SETTING.PATH).toString());
      const settings: SettingReducerInterface = {
        defaultCategory: data.defaultCategory,
        defaultLanguage: data.defaultLanguage
      };
      updateSettings(dispatch, settings);
    }
  } catch (error) {
    showMessage.error(error);
  }
};

const updateSettings = (
  dispatch: Dispatch,
  settings?: SettingReducerInterface
): void => {
  try {
    if (settings) {
      fs.writeFileSync(SETTING.PATH, ini.encode(settings));
      dispatch({ type: UPDATE_SETTINGS, payload: settings });
    } else {
      fs.writeFileSync(SETTING.PATH, ini.encode(SETTING.DEFAULT));
      dispatch({ type: UPDATE_SETTINGS, payload: SETTING.DEFAULT });
    }
  } catch (error) {
    showMessage.error(error);
  }
};

export { getSettings, updateSettings };
