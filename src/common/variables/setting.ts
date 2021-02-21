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
      defaultSearchParams: '',
      isSearchRandomly: 'no',
      defaultCategory: '',
      defaultLanguage: ''
    },
    shortcut: {
      defaultExternalProgram: '',
      openFolderInExternalProgram: 'q',
      openFolderInExplorer: 'w',
      addTagsToFolder: 'e',
      editTagsOfFolder: 's',
      removeTagsFromFolder: 'd',
      focusSearchInput: 'f'
    }
  },
  RELATION_PATH
};

export default SETTING;
