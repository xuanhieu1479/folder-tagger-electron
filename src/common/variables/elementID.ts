const ELEMENT_ID = {
  SETTING_DIALOG_TABS: {
    container: 'setting-dialog-tabs',
    defaultValue: 'setting-dialog-tab-default-value',
    shortcut: 'setting-dialog-tab-shortcut'
  },
  FOLDER_CARD_CONTAINER: 'folder-card-container',
  FOLDER_CARD: (index: number | string): string => `folder-card-${index}`
};

export default ELEMENT_ID;
