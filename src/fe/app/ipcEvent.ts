import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { IPC_EVENT } from '../../common/variables/commonVariables';
import { addFolders } from '../redux/folder/folderAction';

const initIpcEventListeners = (
  dispatch: Dispatch,
  onOpenSettingDialog: () => void
): void => {
  ipcRenderer.on(IPC_EVENT.ADD_FOLDERS, (_event, data) => {
    const { folderLocations } = data;
    addFolders(dispatch, folderLocations);
  });
  ipcRenderer.on(IPC_EVENT.OPEN_SETTING, () => {
    onOpenSettingDialog();
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_FOLDERS);
  ipcRenderer.removeAllListeners(IPC_EVENT.OPEN_SETTING);
};

export { initIpcEventListeners, clearIpcEventListerners };
