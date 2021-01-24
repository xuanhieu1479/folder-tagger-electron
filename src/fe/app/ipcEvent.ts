import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { IPC_EVENT } from '../../common/variables/commonVariables';
import { addFolders } from '../redux/folder/folderAction';

const initIpcEventListeners = (dispatch: Dispatch): void => {
  ipcRenderer.on(IPC_EVENT.ADD_FOLDERS, (_event, data) => {
    const { folderLocations } = data;
    addFolders(dispatch, folderLocations);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_FOLDERS);
};

export { initIpcEventListeners, clearIpcEventListerners };
