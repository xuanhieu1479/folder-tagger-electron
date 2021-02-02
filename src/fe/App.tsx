import React, { ReactElement, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from './config/axiosConfig';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import { SettingDialog } from './components/commonComponents';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';
import { onOpenDialog, onCloseDialog } from './redux/status/statusAction';
import { getCategories, getLanguages } from './redux/folder/folderAction';
import { getSettings } from './redux/setting/settingAction';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false);

  useEffect(() => {
    initIpcEventListeners(dispatch, onOpenSettingDialog);
    getCategories(dispatch);
    getLanguages(dispatch);
    getSettings(dispatch);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  const onOpenSettingDialog = () => {
    setIsSettingDialogOpen(true);
    onOpenDialog(dispatch);
  };
  const onCloseSettingDialog = () => {
    setIsSettingDialogOpen(false);
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
