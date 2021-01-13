import { Menu } from 'electron';
import {
  onOpenDevtool,
  onAddFolder,
  onAddParentFolder
} from './menuActions/menuActions';

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
        click: onOpenDevtool
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
