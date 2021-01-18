import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from '../common/config/axiosConfig';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';
import { getCategories, getLanguages } from './redux/folder/folderAction';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    initIpcEventListeners(dispatch);
    getCategories(dispatch);
    getLanguages(dispatch);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  return <FoldersDisplay />;
};

export default App;
