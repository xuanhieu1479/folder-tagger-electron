const FOLDER_DIALOG_INPUT_PREFIX = 'folder-dialog-input';

const ELEMENT_ID = {
  SETTING_DIALOG_TABS: {
    container: 'setting-dialog-tabs',
    defaultValue: 'setting-dialog-tab-default-value',
    shortcut: 'setting-dialog-tab-shortcut'
  },
  FOLDER_CARD_CONTAINER: 'folder-card-container',
  FOLDER_CARD: (index: number | string): string => `folder-card-${index}`,
  SEARCH_INPUT: 'header-search-input',
  FOLDER_DIALOG_INPUT_PREFIX,
  FOLDER_DIALOG_INPUT: (index: number | string): string =>
    `${FOLDER_DIALOG_INPUT_PREFIX}-${index}`
};

export default ELEMENT_ID;
