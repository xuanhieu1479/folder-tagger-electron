import React, { ReactElement, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Tabs, Tab, TabId, Button, Intent } from '@blueprintjs/core';
import {
  RootState,
  SettingReducerInterface,
  SettingDefaultValueInterface
} from '../../../common/interfaces/feInterfaces';
import { ELEMENT_ID } from '../../../common/variables/commonVariables';
import SettingDefaultValues from './SettingDefaultValue';
import { updateSettings } from '../../redux/setting/settingAction';
import './SettingDialog.styled.scss';

interface FolderDialogInterface {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const SettingDialog = ({
  isOpen,
  onClose,
  title
}: FolderDialogInterface): ReactElement => {
  const dispatch = useDispatch();
  const [selectecdTabId, setSelectedTabId] = useState<TabId>(
    ELEMENT_ID.SETTING_DIALOG_TABS.defaultValue
  );
  const previousSettings = useSelector((state: RootState) => state.setting);
  const [settings, setSettings] = useState<SettingReducerInterface>({
    ...previousSettings
  });

  useEffect(() => {
    setSettings(previousSettings);
  }, [isOpen]);

  const onChangeTab = (newTabId: TabId) => {
    setSelectedTabId(newTabId);
  };

  const onUpdateSettings = (newSettings: SettingDefaultValueInterface) => {
    setSettings({ ...settings, ...newSettings });
  };

  const onSave = () => {
    updateSettings(dispatch, settings);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      className="setting-dialog_container"
    >
      <Tabs
        large={true}
        id={ELEMENT_ID.SETTING_DIALOG_TABS.container}
        selectedTabId={selectecdTabId}
        onChange={onChangeTab}
      >
        <Tab
          id={ELEMENT_ID.SETTING_DIALOG_TABS.defaultValue}
          title="Default Values"
          panel={
            <div className="setting-dialog_tab-panel">
              <SettingDefaultValues
                defaultValueSetting={settings}
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
