import React, { ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosConfig from '../common/config/axiosConfig';
import {
  initIpcEventListeners,
  clearIpcEventListerners
} from './actions/ipcEvent';
import MainBody from './modules/mainBody/MainBody';
import { START_LOADING, FINISH_LOADING } from './redux/status/statusActionType';

axiosConfig();

const App = (): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    initIpcEventListeners(startLoading, finishLoading);

    return () => {
      clearIpcEventListerners();
    };
  }, []);

  const startLoading = () => {
    dispatch({ type: START_LOADING });
  };

  const finishLoading = () => {
    dispatch({ type: FINISH_LOADING });
  };

  return (
    <section className="app-container">
      <MainBody />
    </section>
  );
};

export default App;
