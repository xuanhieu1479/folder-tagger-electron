const SETTING_DIRECTORY = 'Setting';
const SETTING_NAME = 'setting.ini';
const SETTING_PATH = `${SETTING_DIRECTORY}/${SETTING_NAME}`;

const SETTING = {
  DIRECTORY: SETTING_DIRECTORY,
  NAME: SETTING_NAME,
  PATH: SETTING_PATH,
  DEFAULT: {
    defaultCategory: '',
    defaultLanguage: ''
  }
};

export default SETTING;
