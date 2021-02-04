import { dialog, app, BrowserWindow } from 'electron';
import fs from 'fs';
import { IPC_EVENT } from '../../common/variables/commonVariables';

const onAddFolder = (): void => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory) {
    const selectedDirectory = directory[0];
    BrowserWindow.getFocusedWindow()?.webContents.send(IPC_EVENT.ADD_FOLDERS, {
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
    BrowserWindow.getFocusedWindow()?.webContents.send(IPC_EVENT.ADD_FOLDERS, {
      folderLocations: subDirectories
    });
  }
};

export { onAddFolder, onAddParentFolder };
