import React, { ReactElement } from 'react';
import { FileInput } from '@blueprintjs/core';
import {
  SettingReducer,
  SettingShortcut
} from '../../../common/interfaces/feInterfaces';

interface SettingShortcuts {
  shortcutSettings: SettingShortcut;
  onUpdateSettings: (newSettings: Partial<SettingReducer>) => void;
}

const SettingShortcuts = ({
  shortcutSettings,
  onUpdateSettings
}: SettingShortcuts): ReactElement => {
  const { defaultExternalProgram } = shortcutSettings;

  const onChangeExtenalProgram = (event: React.FormEvent<HTMLInputElement>) => {
    const { files } = event.target as HTMLInputElement;
    if (files && files[0]) {
      const newSettings = {
        shortcut: {
          defaultExternalProgram: files[0].path
        }
      };
      onUpdateSettings(newSettings);
    }
  };

  return (
    <>
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
    </>
  );
};

export default SettingShortcuts;
