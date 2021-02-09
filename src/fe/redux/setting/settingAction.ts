import fs from 'fs';
import ini from 'ini';
import { Dispatch } from 'redux';
import { SettingReducerInterface } from '../../../common/interfaces/feInterfaces';
import { SETTING } from '../../../common/variables/commonVariables';
import { UPDATE_SETTINGS } from './settingActionType';
import { writeToFile, fileExists } from '../../../utilities/utilityFunctions';
import { showMessage } from '../../../utilities/feUtilities';

const getSettings = (dispatch: Dispatch): void => {
  try {
    if (!fileExists(SETTING.PATH)) {
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
    const payload = settings || SETTING.DEFAULT;
    writeToFile(SETTING.DIRECTORY, SETTING.PATH, ini.encode(payload), true);
    dispatch({ type: UPDATE_SETTINGS, payload });
  } catch (error) {
    showMessage.error(error);
  }
};

export { getSettings, updateSettings };
