import { dialog, app, BrowserWindow } from 'electron';
import fs from 'fs';
import { IpcEvent } from '../../common/enums/commonEnums';

const onImportData = (): void => {
  const file = dialog.showOpenDialogSync({
    title: 'Improt data',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (file) {
    const json = file[0];
    const data = JSON.parse(fs.readFileSync(json).toString());
    BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.ImportData, {
      json: data
    });
  }
};
const onExportData = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.ExportData);
};

const onClearNonexistentFolders = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(
    IpcEvent.ClearNonexistentFolders
  );
};
const onClearUnusedTags = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.ClearUnusedTags);
};
const onUpdateMissingThumbnails = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(
    IpcEvent.UpdateMissingThumbnails
  );
};

export {
  onImportData,
  onExportData,
  onClearNonexistentFolders,
  onClearUnusedTags,
  onUpdateMissingThumbnails
};
