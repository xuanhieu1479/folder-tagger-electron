import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from '../common/config/axiosConfig';
import { initIpcEventListeners, clearIpcEventListerners } from './app/ipcEvent';
import FoldersDisplay from './modules/foldersDisplay/FoldersDisplay';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    initIpcEventListeners(dispatch);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  return <FoldersDisplay />;
};

export default App;
