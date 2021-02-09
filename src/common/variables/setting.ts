const SETTING_DIRECTORY = 'Setting';
const SETTING_NAME = 'setting.ini';
const SETTING_PATH = `${SETTING_DIRECTORY}/${SETTING_NAME}`;
const RELATION_NAME = 'tags-relations.json';
const RELATION_PATH = `${SETTING_DIRECTORY}/${RELATION_NAME}`;

const SETTING = {
  DIRECTORY: SETTING_DIRECTORY,
  NAME: SETTING_NAME,
  PATH: SETTING_PATH,
  DEFAULT: {
    defaultCategory: '',
    defaultLanguage: ''
  },
  RELATION_PATH
};

export default SETTING;
