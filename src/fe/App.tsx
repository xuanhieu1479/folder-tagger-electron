import React, { ReactElement, useEffect } from 'react';
import axiosConfig from '../common/config/axiosConfig';
import {
  initIpcEventListeners,
  clearIpcEventListerners
} from './actions/ipcEvent';
import MainBody from './modules/mainBody/MainBody';

axiosConfig();

const App = (): ReactElement => {
  useEffect(() => {
    initIpcEventListeners();

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  return (
    <section className="app-container">
      <MainBody />
    </section>
  );
};

export default App;
