import { dialog, app, webContents } from 'electron';
import fs from 'fs';
import { IPC_EVENT } from '../../common/variables/commonVariables';

const onAddFolder = (): void => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory !== undefined) {
    const selectedDirectory = directory[0];
    webContents.getFocusedWebContents()?.send(IPC_EVENT.ADD_ONE_FOLDER, {
      folderLocation: selectedDirectory
    });
  }
};

const onAddParentFolder = (): void => {
  const directory = dialog.showOpenDialogSync({
    title: 'Add parent folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory !== undefined) {
    const parentDirectory = directory[0];
    const subDirectories = fs
      .readdirSync(parentDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => `${parentDirectory}\\${dirent.name}`);
    webContents.getFocusedWebContents()?.send(IPC_EVENT.ADD_PARENT_FOLDER, {
      folderLocations: subDirectories
    });
  }
};

export { onAddFolder, onAddParentFolder };
