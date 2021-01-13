import { ipcRenderer } from 'electron';
import { IPC_EVENT } from '../../common/variables/commonVariables';
import { addOneFolder, addParentFolder } from './folder';

const initIpcEventListeners = (): void => {
  ipcRenderer.on(IPC_EVENT.ADD_ONE_FOLDER, (_event, data) => {
    const { folderLocation } = data;
    addOneFolder(folderLocation);
  });
  ipcRenderer.on(IPC_EVENT.ADD_PARENT_FOLDER, (_event, data) => {
    const { folderLocations } = data;
    addParentFolder(folderLocations);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_ONE_FOLDER);
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_PARENT_FOLDER);
};

export { initIpcEventListeners, clearIpcEventListerners };
