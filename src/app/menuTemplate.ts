import { Menu } from 'electron';
import {
  onOpenDevtool,
  onReload,
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
        label: 'Toggle Devtool',
        accelerator: 'F12',
        click: onOpenDevtool
      },
      {
        label: 'Reload',
        accelerator: 'F5',
        click: onReload
      }
    ]
  }
];

export default Menu.buildFromTemplate(menuTemplate);
