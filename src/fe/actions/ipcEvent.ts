import { ipcRenderer } from 'electron';
import { IPC_EVENT } from '../../common/variables/commonVariables';
import { addOneFolder } from './folder';

const initIpcEventListeners = (): void => {
  ipcRenderer.on(IPC_EVENT.ADD_ONE_FOLDER, (_event, data) => {
    const { folderLocation } = data;
    addOneFolder(folderLocation);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_ONE_FOLDER);
};

export { initIpcEventListeners, clearIpcEventListerners };
