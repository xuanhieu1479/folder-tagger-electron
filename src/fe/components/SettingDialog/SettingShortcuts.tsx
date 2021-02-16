import React, { ReactElement } from 'react';
import _ from 'lodash';
import { FileInput, EditableText } from '@blueprintjs/core';
import {
  SettingReducer,
  SettingShortcut
} from '../../../common/interfaces/feInterfaces';
import { MESSAGE } from '../../../common/variables/commonVariables';
import { showMessage } from '../../../utilities/feUtilities';

interface SettingShortcuts {
  shortcutSettings: SettingShortcut;
  onUpdateSettings: (newSettings: Partial<SettingReducer>) => void;
}
type ShortcutKey =
  | 'openFolderInExternalProgram'
  | 'openFolderInExplorer'
  | 'addTagsToFolder'
  | 'editTagsOfFolder'
  | 'removeTagsFromFolder';
const ShortcutLabel: Record<ShortcutKey, string> = {
  openFolderInExternalProgram: 'Exec Program',
  openFolderInExplorer: 'Open',
  addTagsToFolder: 'Add Tags',
  editTagsOfFolder: 'Edit Tags',
  removeTagsFromFolder: 'Remove Tags'
};

const SettingShortcuts = ({
  shortcutSettings,
  onUpdateSettings
}: SettingShortcuts): ReactElement => {
  const { defaultExternalProgram, ...restProps } = shortcutSettings;
  const shortcutKeys: Record<ShortcutKey, string> = { ...restProps };

  const onChangeExtenalProgram = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.target as HTMLInputElement;
    if (files && files[0]) {
      const newSettings = {
        shortcut: {
          ...shortcutSettings,
          defaultExternalProgram: files[0].path
        }
      };
      onUpdateSettings(newSettings);
    }
  };

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
        showDuplicateError('Open Settings');
        return false;
      case 'c':
        showDuplicateError('Copy Tags');
        return false;
      case 'v':
        showDuplicateError('Paste Tags');
        return false;
    }
    return true;
  };

  const onChangeShortcut = (value: string, shortcutKey: ShortcutKey) => {
    const newShortcut = value.toLowerCase();
    const isValidated = validateShortcut(newShortcut, shortcutKey);

    if (isValidated) {
      const newSettings = {
        shortcut: {
          ...shortcutSettings,
          [shortcutKey]: newShortcut
        }
      };
      onUpdateSettings(newSettings);
    }
  };

  return (
    <section>
      <div className="setting-dialog_tab-panel_row">
        <div className="setting-dialog_tab-panel_row_title">Program</div>
        <div className="setting-dialog_tab-panel_row_content">
          <FileInput
            fill={true}
            buttonText="Select"
            hasSelection={true}
            text={defaultExternalProgram}
            inputProps={{
              accept: '.exe',
              onChange: onChangeExtenalProgram
            }}
          />
        </div>
      </div>
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
