import { dialog, app, BrowserWindow } from 'electron';
import fs from 'fs';
import { IpcEvent } from '../../common/enums/commonEnums';
import { showContinueConfirmation } from '../../utilities/utilityFunctions';

const onImportData = (): void => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow) return;
  const choice = dialog.showMessageBoxSync(focusedWindow, {
    type: 'question',
    buttons: ['Cancel', 'Append', 'Overwrite'],
    defaultId: 0,
    title: 'Confirmation',
    message: 'Pick an import mode.',
    cancelId: 0
  });
  if (choice === 0) return;
  const isOverwrite = choice === 2;
  const file = dialog.showOpenDialogSync({
    title: 'Improt data',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (file) {
    const json = file[0];
    const data = JSON.parse(fs.readFileSync(json).toString());
    focusedWindow?.webContents.send(IpcEvent.ImportData, {
      json: data,
      isOverwrite
    });
  }
};
const onExportData = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.ExportData);
};

const onManageTags = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.OpenManageTags);
};

const onClearFoldersUpdateThumbnails = (): void => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (!focusedWindow) return;
  const userAgrees = showContinueConfirmation(focusedWindow);
  if (!userAgrees) return;
  focusedWindow.webContents.send(IpcEvent.ClearFoldersUpdateThumbnails);
};
const onClearUnusedTags = (): void => {
  BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.ClearUnusedTags);
};

export {
  onImportData,
  onExportData,
  onManageTags,
  onClearFoldersUpdateThumbnails,
  onClearUnusedTags
};
