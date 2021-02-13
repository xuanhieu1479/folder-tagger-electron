import React, { ReactElement, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from './config/axiosConfig';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import { SettingDialog } from './components/commonComponents';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';
import { onOpenDialog, onCloseDialog } from './redux/status/statusAction';
import { getCategories, getLanguages } from './redux/folder/folderAction';
import { loadTagRelations } from './redux/tag/tagAction';
import { getSettings } from './redux/setting/settingAction';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();
  const [isSettingDialogOpen, setSettingDialogOpen] = useState(false);

  useEffect(() => {
    initIpcEventListeners(dispatch, onOpenSettingDialog);
    getCategories(dispatch);
    getLanguages(dispatch);
    getSettings(dispatch);
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

  return (
    <>
      <FoldersDisplay openSettingDialog={onOpenSettingDialog} />
      <SettingDialog
        isOpen={isSettingDialogOpen}
        onClose={onCloseSettingDialog}
        title="Settings"
      />
    </>
  );
};

export default App;
