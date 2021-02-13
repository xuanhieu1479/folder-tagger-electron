import { dialog, app, BrowserWindow } from 'electron';
import fs from 'fs';
import { IpcEvent } from '../../common/enums/commonEnums';

const onAddFolder = (): void => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory) {
    const selectedDirectory = directory[0];
    BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.AddFolders, {
      folderLocations: [selectedDirectory]
    });
  }
};

const onAddParentFolder = (): void => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add parent folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory) {
    const parentDirectory = directory[0];
    const subDirectories = fs
      .readdirSync(parentDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => `${parentDirectory}\\${dirent.name}`);
    BrowserWindow.getFocusedWindow()?.webContents.send(IpcEvent.AddFolders, {
      folderLocations: subDirectories
    });
  }
};

export { onAddFolder, onAddParentFolder };
