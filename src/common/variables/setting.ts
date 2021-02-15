const DIRECTORY = 'Setting';
const NAME = 'setting.ini';
const PATH = `${DIRECTORY}/${NAME}`;
const RELATION_NAME = 'tags-relations.json';
const RELATION_PATH = `${DIRECTORY}/${RELATION_NAME}`;

const SETTING = {
  DIRECTORY,
  NAME,
  PATH,
  DEFAULT: {
    defaultValue: {
      defaultCategory: '',
      defaultLanguage: ''
    },
    shortcut: {
      defaultExternalProgram: ''
    }
  },
  RELATION_PATH
};

export default SETTING;
