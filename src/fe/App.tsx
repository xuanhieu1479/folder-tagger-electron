import React, { ReactElement, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import axiosConfig from '../common/config/axiosConfig';
import { ADD_ONE_FOLDER_API } from '../common/variables/api';
import { addOneFolder } from './actions/folder';

axiosConfig();

const App = (): ReactElement => {
  useEffect(() => {
    ipcRenderer.on(ADD_ONE_FOLDER_API, (_event, data) => {
      const { folderLocation } = data;
      addOneFolder(folderLocation);
    });

    return () => {
      ipcRenderer.removeAllListeners(ADD_ONE_FOLDER_API);
    };
  }, []);

  return <></>;
};

export default App;
