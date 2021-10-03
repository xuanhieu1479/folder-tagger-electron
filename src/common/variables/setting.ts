import { BreakDownTagType } from '../interfaces/commonInterfaces';
import {
  SettingDefaultValue,
  SettingShortcut,
  SettingReducer
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
  placeholderCategory: '',
  placeholderLanguage: '',
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
const CLIPBOARD: Record<BreakDownTagType, string> = {
  author: 'yes',
  parody: 'no',
  character: 'no',
  genre: 'no'
};
const SETTING_DEFAULT: SettingReducer = {
  defaultValue: DEFAULT_VALUE,
  shortcut: SHORTCUT,
  clipboard: CLIPBOARD
};

const SETTING = {
  DIRECTORY,
  NAME,
  PATH,
  DEFAULT: SETTING_DEFAULT,
  RELATION_PATH
};

export default SETTING;
