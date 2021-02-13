import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { IpcEvent } from '../../common/enums/commonEnums';
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
  ipcRenderer.on(IpcEvent.AddFolders, (_event, data) => {
    const { folderLocations } = data;
    addFolders(dispatch, folderLocations);
  });
  ipcRenderer.on(IpcEvent.OpenSetting, () => {
    onOpenSettingDialog();
  });
  ipcRenderer.on(IpcEvent.ImportData, (_event, data) => {
    const { json } = data;
    importFolders(dispatch, json);
  });
  ipcRenderer.on(IpcEvent.ExportData, () => {
    exportFolders(dispatch);
  });
  ipcRenderer.on(IpcEvent.CalculateTagRelations, () => {
    calculateTagRelations(dispatch);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IpcEvent.AddFolders);
  ipcRenderer.removeAllListeners(IpcEvent.OpenSetting);
  ipcRenderer.removeAllListeners(IpcEvent.ImportData);
  ipcRenderer.removeAllListeners(IpcEvent.ExportData);
  ipcRenderer.removeAllListeners(IpcEvent.CalculateTagRelations);
};

export { initIpcEventListeners, clearIpcEventListerners };
