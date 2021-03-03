import {
  SettingDefaultValue,
  SettingShortcut
} from '../interfaces/feInterfaces';

const DIRECTORY = 'Setting';
const NAME = 'setting.ini';
const PATH = `${DIRECTORY}/${NAME}`;
const RELATION_NAME = 'tags-relations.json';
const RELATION_PATH = `${DIRECTORY}/${RELATION_NAME}`;

const DEFAULT_VALUE: SettingDefaultValue = {
  defaultSearchParams: '',
  defaultExternalProgram: '',
  isSearchRandomly: 'no',
  defaultCategory: '',
  defaultLanguage: ''
};
const SHORTCUT: SettingShortcut = {
  openFolderInExternalProgram: 'q',
  openFolderInExplorer: 'w',
  renameFolder: 'r',
  addTagsToFolder: 'e',
  editTagsOfFolder: 's',
  removeTagsFromFolder: 'd',
  focusSearchInput: 'f'
};

const SETTING = {
  DIRECTORY,
  NAME,
  PATH,
  DEFAULT: {
    defaultValue: DEFAULT_VALUE,
    shortcut: SHORTCUT
  },
  RELATION_PATH
};

export default SETTING;
