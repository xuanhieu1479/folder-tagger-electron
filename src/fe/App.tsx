import React, { ReactElement, useEffect } from 'react';
import axiosConfig from '../common/config/axiosConfig';
import {
  initIpcEventListeners,
  clearIpcEventListerners
} from './actions/ipcEvent';

axiosConfig();

const App = (): ReactElement => {
  useEffect(() => {
    initIpcEventListeners();

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  return <></>;
};

export default App;
