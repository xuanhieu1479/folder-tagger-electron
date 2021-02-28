const FOLDER_DIALOG_INPUT_PREFIX = 'folder-dialog-input';

const ELEMENT_ID = {
  SETTING_DIALOG_TABS: {
    container: 'setting-dialog-tabs',
    defaultValue: 'setting-dialog-tab-default-value',
    shortcut: 'setting-dialog-tab-shortcut'
  },
  FOLDER_CARD_CONTAINER: 'folder-card-container',
  FOLDER_CARD: (index: number | string): string => `folder-card-${index}`,
  FOLDER_DIALOG_INPUT_PREFIX,
  FOLDER_DIALOG_INPUT: (index: number | string): string =>
    `${FOLDER_DIALOG_INPUT_PREFIX}-${index}`,
  HEADER_SEARCH_INPUT: 'header-input-search',
  HEADER_CATEGORY_SELECT: 'header-input-category',
  HEADER_LANGUAGE_SELECT: 'header-input-language'
};

export default ELEMENT_ID;
