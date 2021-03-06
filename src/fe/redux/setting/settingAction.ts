import fs from 'fs';
import ini from 'ini';
import { Dispatch } from 'redux';
import _ from 'lodash';
import { SettingReducer } from '../../../common/interfaces/feInterfaces';
import { SETTING } from '../../../common/variables/commonVariables';
import { UPDATE_SETTINGS } from './settingActionType';
import { writeToFile, fileExists } from '../../../utilities/utilityFunctions';
import { showMessage } from '../../../utilities/feUtilities';

const getSettings = (dispatch: Dispatch, onSuccess: () => void): void => {
  try {
    if (!fileExists(SETTING.PATH)) {
      updateSettings(dispatch);
    } else {
      const { defaultValue, shortcut } = SETTING.DEFAULT;
      const data = ini.parse(fs.readFileSync(SETTING.PATH).toString());
      const settings: SettingReducer = {
        defaultValue: {
          ...defaultValue,
          ..._.pick(data.defaultValue, Object.keys(defaultValue))
        },
        shortcut: {
          ...shortcut,
          ..._.pick(data.shortcut, Object.keys(shortcut))
        }
      };
      updateSettings(dispatch, settings);
      onSuccess();
    }
  } catch (error) {
    showMessage.error(error);
  }
};

const updateSettings = (
  dispatch: Dispatch,
  settings?: SettingReducer
): void => {
  try {
    const payload = settings || SETTING.DEFAULT;
    writeToFile(SETTING.DIRECTORY, SETTING.PATH, ini.encode(payload));
    dispatch({ type: UPDATE_SETTINGS, payload });
  } catch (error) {
    showMessage.error(error);
  }
};

export { getSettings, updateSettings };
