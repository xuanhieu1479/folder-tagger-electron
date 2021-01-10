import { Menu, dialog, app, webContents } from 'electron';
import { IPC_EVENT } from '../common/variables/commonVariables';

const onAddFolder = () => {
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

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add folder',
        click: onAddFolder
      }
    ]
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Open Devtool',
        accelerator: 'F12',
        click: () => {
          webContents.getFocusedWebContents()?.openDevTools();
        }
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
