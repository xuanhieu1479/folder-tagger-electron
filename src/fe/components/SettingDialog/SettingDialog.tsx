import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Tabs, Tab, TabId, Button, Intent } from '@blueprintjs/core';
import {
  RootState,
  SettingReducer,
  CommonDialog
} from '../../../common/interfaces/feInterfaces';
import { ELEMENT_ID, MESSAGE } from '../../../common/variables/commonVariables';
import {
  fileExists,
  getFolderExtension
} from '../../../utilities/directoryUtilities';
import { showMessage } from '../../../utilities/feUtilities';
import SettingDefaultValues from './SettingDefaultValue';
import SettingShortcuts from './SettingShortcuts';
import { updateSettings } from '../../redux/setting/settingAction';
import './SettingDialog.styled.scss';

const defaultSelectedTabId = ELEMENT_ID.SETTING_DIALOG_TABS.defaultValue;

const SettingDialog = ({ isOpen, onClose }: CommonDialog): ReactElement => {
  const dispatch = useDispatch();
  const [selectedTabId, setSelectedTabId] = useState<TabId>(
    defaultSelectedTabId
  );
  const previousSettings = useSelector((state: RootState) => state.setting);
  const [settings, setSettings] = useState<SettingReducer>({
    ...previousSettings
  });

  useEffect(() => {
    setSettings(previousSettings);
    setSelectedTabId(defaultSelectedTabId);
  }, [isOpen]);

  const onChangeTab = (newTabId: TabId) => {
    setSelectedTabId(newTabId);
  };

  const onUpdateSettings = (newSettings: Partial<SettingReducer>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const onSave = () => {
    const { defaultExternalProgram } = settings.defaultValue;
    const externalProgramPathHasChange =
      defaultExternalProgram !==
      previousSettings.defaultValue.defaultExternalProgram;
    if (externalProgramPathHasChange) {
      if (!fileExists(defaultExternalProgram)) {
        showMessage.error(MESSAGE.EXTERNAL_PROGRAM_PATH_INCORRECT);
        setSelectedTabId(ELEMENT_ID.SETTING_DIALOG_TABS.shortcut);
        return;
      } else if (getFolderExtension(defaultExternalProgram) !== 'exe') {
        showMessage.error(MESSAGE.EXTERNAL_PROGRAM_INVALID);
        setSelectedTabId(ELEMENT_ID.SETTING_DIALOG_TABS.shortcut);
        return;
      }
    }
    updateSettings(dispatch, settings);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      className="setting-dialog_container"
    >
      <Tabs
        large={true}
        id={ELEMENT_ID.SETTING_DIALOG_TABS.container}
        selectedTabId={selectedTabId}
        onChange={onChangeTab}
      >
        <Tab
          id={ELEMENT_ID.SETTING_DIALOG_TABS.defaultValue}
          title="Default Values"
          panel={
            <div className="setting-dialog_tab-panel">
              <SettingDefaultValues
                defaultValueSettings={{ ...settings.defaultValue }}
                onUpdateSettings={onUpdateSettings}
              />
            </div>
          }
        />
        <Tab
          id={ELEMENT_ID.SETTING_DIALOG_TABS.shortcut}
          title="Shortcut"
          panel={
            <div className="setting-dialog_tab-panel">
              <SettingShortcuts
                shortcutSettings={{ ...settings.shortcut }}
                onUpdateSettings={onUpdateSettings}
              />
            </div>
          }
        />
      </Tabs>
      <div className="setting-dialog_tab-panel_row setting-dialog_footer_container">
        <Button
          text="Save"
          intent={Intent.PRIMARY}
          className="setting-dialog_footer_save-button"
          onClick={onSave}
        />
      </div>
    </Dialog>
  );
};

export default SettingDialog;
