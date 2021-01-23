import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from './config/axiosConfig';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';
import { getCategories, getLanguages } from './redux/folder/folderAction';
import { getSettings } from './redux/setting/settingAction';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    initIpcEventListeners(dispatch);
    getCategories(dispatch);
    getLanguages(dispatch);
    getSettings(dispatch);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  return <FoldersDisplay />;
};

export default App;
