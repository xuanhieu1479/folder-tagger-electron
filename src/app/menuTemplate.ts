import { Menu, dialog, app, BrowserWindow } from 'electron';
import { ADD_ONE_FOLDER_API } from '../common/variables/api';

let window;

const onAddFolder = () => {
  window = BrowserWindow.getFocusedWindow();
  const directory = dialog.showOpenDialogSync({
    title: 'Add folder',
    defaultPath: `${app.getPath('desktop')}`,
    properties: ['openDirectory']
  });
  if (directory !== undefined) {
    const selectedDirectory = directory[0];
    window?.webContents.send(ADD_ONE_FOLDER_API, {
      folderLocation: selectedDirectory
    });
  }
};

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add folder',
        click: onAddFolder
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
