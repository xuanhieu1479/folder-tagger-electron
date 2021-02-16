import React, { ReactElement, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from './config/axiosConfig';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import { SettingDialog, ManageTagsDialog } from './components/commonComponents';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';
import { onOpenDialog, onCloseDialog } from './redux/status/statusAction';
import { getCategories, getLanguages } from './redux/folder/folderAction';
import { loadTagRelations } from './redux/tag/tagAction';
import { getSettings } from './redux/setting/settingAction';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();
  const [isSettingDialogOpen, setSettingDialogOpen] = useState(false);
  const [isManageTagsDialogOpen, setManageTagsDialogOpen] = useState(false);
  const [isSettingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const onSuccessGetSettings = () => setSettingsLoaded(true);

    initIpcEventListeners(
      dispatch,
      onOpenSettingDialog,
      onOpenManageTagsDialog
    );
    getCategories(dispatch);
    getLanguages(dispatch);
    getSettings(dispatch, onSuccessGetSettings);
    loadTagRelations(dispatch);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  const onOpenSettingDialog = () => {
    setSettingDialogOpen(true);
    onOpenDialog(dispatch);
  };
  const onCloseSettingDialog = () => {
    setSettingDialogOpen(false);
    onCloseDialog(dispatch);
  };

  const onOpenManageTagsDialog = () => {
    setManageTagsDialogOpen(true);
    onOpenDialog(dispatch);
  };
  const onCloseManageTagsDialog = () => {
    setManageTagsDialogOpen(false);
    onCloseDialog(dispatch);
  };

  return (
    <>
      {isSettingsLoaded ? (
        <FoldersDisplay openSettingDialog={onOpenSettingDialog} />
      ) : null}
      <SettingDialog
        isOpen={isSettingDialogOpen}
        onClose={onCloseSettingDialog}
      />
      <ManageTagsDialog
        isOpen={isManageTagsDialogOpen}
        onClose={onCloseManageTagsDialog}
      />
    </>
  );
};

export default App;
