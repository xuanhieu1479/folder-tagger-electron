import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { IPC_EVENT } from '../../common/enums/commonEnums';
import {
  addFolders,
  exportFolders,
  importFolders
} from '../redux/folder/folderAction';
import { calculateTagRelations } from '../redux/tag/tagAction';

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
  ipcRenderer.on(IPC_EVENT.IMPORT_DATA, (_event, data) => {
    const { json } = data;
    importFolders(dispatch, json);
  });
  ipcRenderer.on(IPC_EVENT.EXPORT_DATA, () => {
    exportFolders(dispatch);
  });
  ipcRenderer.on(IPC_EVENT.CALCULATE_TAGS_RELATION, () => {
    calculateTagRelations(dispatch);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IPC_EVENT.ADD_FOLDERS);
  ipcRenderer.removeAllListeners(IPC_EVENT.OPEN_SETTING);
  ipcRenderer.removeAllListeners(IPC_EVENT.IMPORT_DATA);
  ipcRenderer.removeAllListeners(IPC_EVENT.EXPORT_DATA);
  ipcRenderer.removeAllListeners(IPC_EVENT.CALCULATE_TAGS_RELATION);
};

export { initIpcEventListeners, clearIpcEventListerners };
