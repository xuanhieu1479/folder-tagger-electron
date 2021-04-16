import { ipcRenderer } from 'electron';
import { Dispatch } from 'redux';
import { IpcEvent } from '../../common/enums/commonEnums';
import {
  addFolders,
  exportFolders,
  importFolders,
  clearFoldersUpdateThumbnails
} from '../redux/folder/folderAction';
import { calculateTagRelations, clearUnusedTags } from '../redux/tag/tagAction';

const initIpcEventListeners = (
  dispatch: Dispatch,
  onOpenSettingDialog: () => void,
  onOpenManageTagsDialog: () => void,
  refreshFolders: () => void
): void => {
  ipcRenderer.on(IpcEvent.AddFolders, (_event, data) => {
    const { folderLocations } = data;
    addFolders(dispatch, folderLocations, refreshFolders);
  });
  ipcRenderer.on(IpcEvent.OpenSetting, () => {
    onOpenSettingDialog();
  });
  ipcRenderer.on(IpcEvent.OpenManageTags, () => {
    onOpenManageTagsDialog();
  });
  ipcRenderer.on(IpcEvent.ImportData, async (_event, data) => {
    const { json, isOverwrite } = data;
    importFolders(dispatch, json, isOverwrite, refreshFolders);
  });
  ipcRenderer.on(IpcEvent.ExportData, () => {
    exportFolders(dispatch);
  });
  ipcRenderer.on(IpcEvent.OnStartupExport, () => {
    exportFolders();
  });
  ipcRenderer.on(IpcEvent.ClearFoldersUpdateThumbnails, () => {
    clearFoldersUpdateThumbnails(dispatch, refreshFolders);
  });
  ipcRenderer.on(IpcEvent.ClearUnusedTags, () => {
    clearUnusedTags(dispatch);
  });
  ipcRenderer.on(IpcEvent.CalculateTagRelations, () => {
    calculateTagRelations(dispatch);
  });
};

const clearIpcEventListerners = (): void => {
  ipcRenderer.removeAllListeners(IpcEvent.AddFolders);
  ipcRenderer.removeAllListeners(IpcEvent.OpenSetting);
  ipcRenderer.removeAllListeners(IpcEvent.OpenManageTags);
  ipcRenderer.removeAllListeners(IpcEvent.ImportData);
  ipcRenderer.removeAllListeners(IpcEvent.ExportData);
  ipcRenderer.removeAllListeners(IpcEvent.OnStartupExport);
  ipcRenderer.removeAllListeners(IpcEvent.ClearFoldersUpdateThumbnails);
  ipcRenderer.removeAllListeners(IpcEvent.ClearUnusedTags);
  ipcRenderer.removeAllListeners(IpcEvent.CalculateTagRelations);
};

export { initIpcEventListeners, clearIpcEventListerners };
