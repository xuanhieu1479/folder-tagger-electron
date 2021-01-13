import { Menu, webContents } from 'electron';
import { onAddFolder, onAddParentFolder } from './menuActions/menuActions';

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add folder',
        click: onAddFolder
      },
      {
        label: 'Add parent folder',
        click: onAddParentFolder
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
