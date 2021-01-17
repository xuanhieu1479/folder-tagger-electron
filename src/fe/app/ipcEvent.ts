import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { IPC_EVENT } from '../../common/variables/commonVariables';
import { addOneFolder, addParentFolder } from '../redux/folder/folderAction';

const initIpcEventListeners = (dispatch: Dispatch): void => {
  ipcRenderer.on(IPC_EVENT.ADD_ONE_FOLDER, (_event, data) => {
    const { folderLocation } = data;
    addOneFolder(dispatch, folderLocation);
  });
  ipcRenderer.on(IPC_EVENT.ADD_PARENT_FOLDER, (_event, data) => {
    const { folderLocations } = data;
    addParentFolder(dispatch, folderLocations);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_ONE_FOLDER);
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_PARENT_FOLDER);
};

export { initIpcEventListeners, clearIpcEventListerners };
