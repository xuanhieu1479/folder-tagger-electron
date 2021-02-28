import React, { ReactElement } from 'react';
import _ from 'lodash';
import { EditableText } from '@blueprintjs/core';
import {
  SettingReducer,
  SettingShortcut
} from '../../../common/interfaces/feInterfaces';
import { MESSAGE, SHORTCUT } from '../../../common/variables/commonVariables';
import { showMessage } from '../../../utilities/feUtilities';

interface SettingShortcuts {
  shortcutSettings: SettingShortcut;
  onUpdateSettings: (newSettings: Partial<SettingReducer>) => void;
}
type ShortcutKey = keyof SettingShortcut;
const ShortcutLabel: SettingShortcut = {
  openFolderInExternalProgram: 'Exec Program',
  openFolderInExplorer: 'Open',
  addTagsToFolder: 'Add Tags',
  editTagsOfFolder: 'Edit Tags',
  removeTagsFromFolder: 'Remove Tags',
  focusSearchInput: 'Search'
};

const SettingShortcuts = ({
  shortcutSettings,
  onUpdateSettings
}: SettingShortcuts): ReactElement => {
  const shortcutKeys = { ...shortcutSettings };

  const validateShortcut = (newShortcut: string, shortcutKey: ShortcutKey) => {
    const showDuplicateError = (duplicateShortcut: string) => {
      showMessage.error(
        MESSAGE.SHORTCUT_DUPLICATE(newShortcut, duplicateShortcut)
      );
    };

    if (!new RegExp(/[A-Za-z]/).test(newShortcut)) {
      showMessage.error(MESSAGE.SHORTCUT_ALPHABET);
      return false;
    }
    const duplicateShortcut = _.findKey(
      shortcutSettings,
      (value, key) => key !== shortcutKey && value === newShortcut
    );
    if (duplicateShortcut) {
      const duplicateShortcutKey = duplicateShortcut as ShortcutKey;
      showDuplicateError(ShortcutLabel[duplicateShortcutKey]);
      return false;
    }
    switch (newShortcut) {
      case 't':
      case 'c':
      case 'v':
      case 'a':
        showDuplicateError(SHORTCUT.UNCHANGEABLE[newShortcut]);
        return false;
    }
    return true;
  };

  const onChangeShortcut = (value: string, shortcutKey: ShortcutKey) => {
    const newShortcut = value.toLowerCase();
    const isValidated = validateShortcut(newShortcut, shortcutKey);

    if (isValidated) {
      onUpdateSettings({
        shortcut: { ...shortcutSettings, [shortcutKey]: newShortcut }
      });
    }
  };

  return (
    <section>
      {_.map(shortcutKeys, (shortcutValue, shortcutKey: ShortcutKey) => (
        <div key={shortcutKey} className="setting-dialog_tab-panel_row">
          <div className="setting-dialog_tab-panel_row_title">
            {ShortcutLabel[shortcutKey]}
          </div>
          <div className="setting-dialog_tab-panel_row_content">
            <div className="setting-dialog_tab-panel_editable-text">
              <EditableText
                maxLength={1}
                selectAllOnFocus={true}
                value={shortcutValue}
                onChange={value => onChangeShortcut(value, shortcutKey)}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SettingShortcuts;
